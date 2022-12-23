function clearEmptyProperties(object, device, value) {
	Object.keys(object[device].lighthouseResult.audits).forEach(key => {
		if (!object[device].lighthouseResult.audits[key][value]) {
			delete object[device].lighthouseResult.audits[key];
		}
	});

	return object;
}

export default clearEmptyProperties
