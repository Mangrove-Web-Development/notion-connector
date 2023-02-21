const reportService = require('../services/ReportService');

exports.getReports = async (req, res) => {
	try {
		const reports = await reportService.getReports();
		res.status(200).json({
			data: reports,
			status: 'success',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.getReportById = async (req, res) => {
	try {
		const report = await reportService.getReportById(req.params.id);
		res.status(200).json({
			data: report,
			status: 'success',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

exports.createReport = async (req, res) => {
	try {
		const report = await reportService.createReport(req.body);
		res.status(201).json({
			data: report,
			status: 'success',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
