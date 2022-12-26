import './start/require.js';
const express = require('express');
const app = express();
import getDatabase from './api/get.js';

app.get('/database/:databaseId', (req, res) => {
	getDatabase(req.params.databaseId).then(response => {
		console.log(response);
	}).catch(error => { return res.send(error) });
})
