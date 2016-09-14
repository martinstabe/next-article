module.exports = (requestedLayout) => {
	//map some url params to existing ad layout names
	return requestedLayout || 'default';
}
