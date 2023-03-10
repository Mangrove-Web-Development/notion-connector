import './start/require.js';
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Configure mongoose
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://127.0.0.1/reports_db",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Connected to MongoDB");
		}
	}
);

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
			const clientName = client?.properties?.Name?.rich_text[0]?.text?.content;
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
								score: report?.desktop?.lighthouseResult?.categories?.performance?.score * 100,
							},
							loadingExperience: report?.desktop?.loadingExperience,
						},
						mobile: {
							id: report?.id,
							lighthouseResult: {
								audits: report?.mobile?.lighthouseResult?.audits,
								score: report?.desktop?.lighthouseResult?.categories?.performance?.score * 100,
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
					addReport(
						`${reportId}-desktop`,
						formattedDate, clientId,
						JSON.stringify(finalReport.desktop),
						'desktop',
						clientName).then(response => {
						console.log(`${clientId} desktop report added`);
					});

					addReport(
						`${reportId}-mobile`,
						formattedDate,
						clientId,
						JSON.stringify(finalReport.mobile),
						'mobile',
						clientName).then(response => {
						console.log(`${clientId} mobile report added`);
					});
				}
			)
		});
	})
