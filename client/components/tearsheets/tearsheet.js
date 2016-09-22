const API_URL = 'https://next-markets-proxy.ft.com/securities/v1/quotes?source=hover&symbols=';

function Tearsheet () {
	this.init();
}

Tearsheet.prototype.init = function () {
	this.containerEl = document.createElement('div');
	this.containerEl.className = 'tearsheet';

	const headingEl = document.createElement('h4');
	headingEl.className = 'tearsheet__heading';
	this.containerEl.appendChild(headingEl);

	this.titleEl = document.createElement('span');
	this.titleEl.className = 'tearsheet__heading-title';
	headingEl.appendChild(this.titleEl);

	this.symbolEl = document.createElement('span');
	this.symbolEl.className = 'tearsheet__heading-symbol';
	headingEl.appendChild(this.symbolEl);

	this.lastPriceEl = document.createElement('span');
	this.lastPriceEl.className = 'tearsheet__quote-last-price';

	this.currencyEl = document.createElement('span');
	this.currencyEl.className = 'tearsheet__quote-currency';

	this.changeValueEl = document.createElement('span');
	this.changeValueEl.className = 'tearsheet__quote-change-value';

	this.changePercentEl = document.createElement('span');
	this.changePercentEl.className = 'tearsheet__quote-change-percent';

	this.volumeTradedEl = document.createElement('span');
	this.volumeTradedEl.className = 'tearsheet__quote-volume-traded';

	const captionEl = document.createElement('p');
	captionEl.className = 'tearsheet__caption';
	captionEl.textContent = 'Data delayed at least 15 minutes, as of ';
	this.containerEl.appendChild(captionEl);

	this.timeStampEl = document.createElement('time');
	this.timeStampEl.className = 'tearsheet__caption-timestamp';
	captionEl.appendChild(this.timeStampEl);

	// create a HTMLTableElement
	const tableEl = document.createElement('table');
	tableEl.className = 'tearsheet__quote';

	// add table headers
	tableEl.createTHead();
	const headRow = tableEl.tHead.insertRow();

	const head1 = headRow.insertCell();
	head1.textContent = 'Price';
	head1.appendChild(this.currencyEl);

	const head2 = headRow.insertCell();
	head2.textContent = 'Today\'s change';

	const head3 = headRow.insertCell();
	head3.textContent = 'Shares traded';

	// add table body
	tableEl.createTBody();
	const bodyRow = tableEl.tBodies[0].insertRow();

	const body1 = bodyRow.insertCell();
	body1.appendChild(this.lastPriceEl);

	const body2 = bodyRow.insertCell();
	body2.appendChild(this.changeValueEl);
	body2.appendChild(this.changePercentEl);

	const body3 = bodyRow.insertCell();
	body3.appendChild(this.volumeTradedEl);

	this.containerEl.insertBefore(tableEl, captionEl);

	// if you're unsure: console.log(this.containerEl.outerHTML)
};

Tearsheet.prototype.fetch = function (security) {
	// markets data proxy does not expect credentials
	return fetch(API_URL + encodeURIComponent(security))
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw Error(`Tearsheet could not be fetched for ${security}, error ${response.status}`);
			}
		})
		.then((json) => {
			return json && json.data && json.data.items && json.data.items.pop();
		});
};

Tearsheet.prototype.update = function (data) {
	Object.keys(data).forEach((item) => {
		if (this[item + 'El']) {
			this[item + 'El'].innerHTML = data[item];
		}
	});
};

Tearsheet.prototype.attach = function (target) {
	target.appendChild(this.containerEl);
};

Tearsheet.prototype.detach = function () {
	this.containerEl.parentNode.removeChild(this.containerEl);
};

export default Tearsheet;
