import databaseGet from "./get";
import {notion} from "../index";

function databaseUpdate(databaseId, username, status, inputDate) {
  databaseGet(databaseId, username)
    .then(async pageId => {
      try {
        const response = await notion.pages.update({
          page_id: pageId,
          properties: {
            'Status': {
              checkbox: status,
            },
            'Date': {
              type: 'date',
              date: {
                "start": inputDate
              }
            },
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error.body);
      }
    });
}

export default databaseUpdate;
