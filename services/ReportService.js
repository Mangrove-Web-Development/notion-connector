const ReportModel = require('../models/Report');

exports.getReports = async () => {
	return ReportModel.find();
}

exports.createReport = async (report) => {
	return ReportModel.create(report);
}

exports.getReportById = async (id) => {
	return ReportModel.findById(id);
}
