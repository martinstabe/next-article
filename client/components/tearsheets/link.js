import intent from './intent';

function formatVolume (value) {
	if (value > 100000000) {
		return '' + (value / 1000000000).toFixed(2) + '<abbr title="billion">bn</abbr>';
	}
	if (value > 100000) {
		return '' + (value / 1000000).toFixed(2) + '<abbr title="million">m</abbr>';
	}

	return '' + (value / 1000).toFixed(2) + '<abbr title="thousand">k</abbr>';
}

function formatDirection (value) {
	return value > 0 ? 'up' : (value < 0 ? 'down' : '');
}

function formatTimeStamp (value) {
	// TODO: format this
	return new Date(value).toLocaleString();
}

function Link (target, tearsheet) {
	this.target = target;
	this.tearsheet = tearsheet;

	this.onEnter = this.handleEnter.bind(this);
	this.onLeave = this.handleLeave.bind(this);

	this.isOpen = false;
	this.isFetching = false;

	this.init();
}

Link.prototype.init = function () {
	intent(this.target, this.onEnter, this.onLeave);
};

Link.prototype.handleEnter = function () {
	if (this.isOpen || this.isFetching) return;

	const security = this.target.getAttribute('data-symbol');

	this.isFetching = true;

	this.tearsheet.fetch(security)
		.then((item) => {
			item && this.open(item);
		})
		.catch(() => {
			/* do nothing */
		})
		.then(() => {
			this.isFetching = false;
		});
};

Link.prototype.handleLeave = function () {
	if (!this.isOpen) return;
	this.close();
};

Link.prototype.open = function (item) {
	const values = {
		title: item.basic.name,
		symbol: item.basic.symbol,
		currency: item.basic.currency,
		lastPrice: item.quote.lastPrice.toFixed(2),
		timeStamp: formatTimeStamp(item.quote.timeStamp),
		changeValue: Math.abs(item.quote.change1Day).toFixed(2),
		changePercent: Math.abs(item.quote.change1DayPercent).toFixed(2),
		changeDirection: formatDirection(item.quote.change1Day),
		volumeTraded: formatVolume(item.quote.volume)
	};

	this.tearsheet.update(values);
	this.tearsheet.attach(this.target);

	this.isOpen = true;
};

Link.prototype.close = function () {
	if (this.isOpen) {
		this.tearsheet.detach();
		this.isOpen = false;
	}
};

export default Link;
