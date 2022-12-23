const {Client} = require('@notionhq/client');
const dotenv = require('dotenv');
dotenv.config();

export const notion = new Client({auth: process.env.NOTION_API_KEY});
