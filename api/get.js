import {notion} from "./client.js";

async function databaseGet(databaseId, filter, sorts) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
      sorts,
    });
    return response.results;
  } catch (error){
    console.log(error.body);
  }
}

export default databaseGet;
