'use strict';
import {broadcast} from 'n-ui/utils';
const comments = require('./components/comments/main');
const uuid = document.querySelector('article[data-content-id]').getAttribute('data-content-id');

comments.init(uuid);

if (window.FT.commentsRUM) {

	broadcast('oTracking.event', {
		category: 'comments',
		action: 'init',
		context: {
			timing: Date.now() - window.FT.commentsRUMLazyStart
		}
	});

	document.body.addEventListener('oComments.widget.timeout', () => {
		broadcast('oTracking.event', {
			category: 'comments',
			action: 'timeout',
			context: {
				timing: Date.now() - window.FT.commentsRUMLazyStart
			}
		});
	})

	document.body.addEventListener('oComments.error.init', () => {
		broadcast('oTracking.event', {
			category: 'comments',
			action: 'init-error',
			context: {
				timing: Date.now() - window.FT.commentsRUMLazyStart
			}
		});
	})

	document.body.addEventListener('oComments.widget.ready', () => {
		broadcast('oTracking.event', {
			category: 'comments',
			action: 'ui-ready',
			context: {
				timing: Date.now() - window.FT.commentsRUMLazyStart
			}
		});
	})

	document.body.addEventListener('oComments.data.init', () => {
		broadcast('oTracking.event', {
			category: 'comments',
			action: 'data-ready',
			context: {
				timing: Date.now() - window.FT.commentsRUMLazyStart
			}
		});
	})

	document.body.addEventListener('oComments.widget.renderComplete', () => {
		broadcast('oTracking.event', {
			category: 'comments',
			action: 'ready',
			context: {
				timing: Date.now() - window.FT.commentsRUMLazyStart
			}
		});
	})
}
