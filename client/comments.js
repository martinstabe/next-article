'use strict';

const comments = require('./components/comments/main');
const uuid = document.querySelector('article[data-content-id]').getAttribute('data-content-id');
const flags = window.nextFeatureFlags;

comments.init(uuid, flags);
