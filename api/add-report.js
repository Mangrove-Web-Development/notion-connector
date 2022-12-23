import {notion} from "./client.js";
import chunkString from "../utils/chunkString.js";

async function addReport(reportId, date, clientId, report, device) {
	console.log(report.length);
	const reportChunks = chunkString(report, 1900);
	// Map through the chunks and create a new block for each chunk
	const blocks = reportChunks.map(chunk => {

		return {
			object: 'block',
			type: 'paragraph',
			paragraph: {
				rich_text: [
					{
						type: 'text',
						text: {
							content: chunk,
						},
					},
				],
			},
		}
	});

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_REPORTS_DATABASE_ID,
      },
      properties: {
        'ID': {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: reportId,
              },
            },
          ],
        },
				'Date': {
					type: 'date',
					date: {
						start: date
					}
				},
        'Client': {
          type: 'relation',
					relation: [
						{
							"id": clientId
						}
					]
        },
				'Device': {
					"select": {
						"name": device
					}
				}
      },
			children: blocks
    });
  } catch (error) {
    console.error(error.body);
  }
}

export default addReport;
