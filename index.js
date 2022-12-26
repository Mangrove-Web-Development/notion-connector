import './start/require.js';
const dotenv = require('dotenv');

import getDatabase from './api/get.js';
import getReport from "./api/psi.js";
import addReport from "./api/add-report.js";
import clearEmptyProperties from "./utils/clearEmptyProperties.js";

const clientsDatabaseId = process.env.NOTION_CLIENTS_DATABASE_ID;


const getDesktopAndMobileData = async (url) => {
	return {
		desktop: await getReport(url, 'DESKTOP'),
		mobile: await getReport(url, 'MOBILE'),
	}
}

getDatabase(clientsDatabaseId)
	.then(response => {
		// Map through the clients and get the reports for each client
		response.map(client => {
			const clientId = client?.id;
			const clientSlug = client?.properties?.ID?.title[0]?.plain_text;
			const clientUrl = client?.properties?.URL?.url;

			const report = getDesktopAndMobileData(clientUrl).then(
				report => {
					// Iterate through audits and delete if don't have a displayValue
					report = clearEmptyProperties(report, 'desktop', 'displayValue');
					report = clearEmptyProperties(report, 'mobile', 'displayValue');


					// Get only necessary data from the report
					const finalReport = {
						desktop: {
							id: report?.id,
							lighthouseResult: {
								audits: report?.desktop?.lighthouseResult?.audits,
							},
							loadingExperience: report?.desktop?.loadingExperience,
						},
						mobile: {
							id: report?.id,
							lighthouseResult: {
								audits: report?.mobile?.lighthouseResult?.audits,
							},
							loadingExperience: report?.mobile?.loadingExperience,
						}
					}

					const currentDate = new Date();
					// Format the date to YYYY-MM-DD
					const formattedDate = currentDate.toISOString().split('T')[0];

					// Create the report ID
					const reportId = `${clientSlug}-${formattedDate}`;

					// Add the report to the database
					addReport(`${reportId}-desktop`, formattedDate, clientId, JSON.stringify(finalReport.desktop), 'desktop').then(response => {
						console.log(`${clientId} desktop report added`);
					});

					addReport(`${reportId}-mobile`, formattedDate, clientId, JSON.stringify(finalReport.mobile), 'mobile').then(response => {
						console.log(`${clientId} mobile report added`);
					});
				}
			)
		});
	})


const express = require('express');
const app = express();
const cors = require('cors')

app.use(cors())

app.get('/database/:databaseId', (req, res) => {
	getDatabase(req.params.databaseId).then(response => {
		res.status(200).json(response);
	}).catch(error => { return res.send(error) });
})

app.listen(5000, () => { console.log('Server started on port 5000') });
