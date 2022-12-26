import './start/require.js';
const express = require('express');
const cors = require('cors')
const app = express();
import getDatabase from './api/get.js';


app.use(cors())
app.get('/database/:databaseId', (req, res) => {
	getDatabase(req.params.databaseId).then(response => {
		res.status(200).json(response);
	}).catch(error => { return res.send(error) });
})

app.listen(5001, () => { console.log('Server started on port 5000') });
