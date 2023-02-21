const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const ReportSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	client: {
		type: String,
		required: true,
	},
	reportData: {
		type: Schema.Types.Mixed,
	},
});

const Report = mongoose.model("Report", ReportSchema);

module.exports = Report;
