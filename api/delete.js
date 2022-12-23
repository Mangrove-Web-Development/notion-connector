import {notion} from "../index";
import databaseGet from "./get";

function deleteItem(databaseId, username) {
  try {
    databaseGet(databaseId, username)
      .then(async pageId => {

        const response = await notion.blocks.delete({
          block_id: pageId,
        });
        console.log(response);

      })
  } catch (error) {
    console.log(error.body);
  }
}

export default deleteItem;
