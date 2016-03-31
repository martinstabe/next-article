'use strict';

const createSkeleton = {
	init: function() {
		const skeleton = document.createElement('div');
		const skeletonInner = document.createElement('div');
		const skeletonPod = document.createElement('div');
		const skeletonEdit = document.createElement('div');
		const skeletonFollow = document.createElement('div');
		const skeletonSubmit = document.createElement('div');
		const commentsEl = document.querySelector('#comments');

		skeleton.className = 'skeleton';
		skeleton.setAttribute('data-skeleton', 'comments');
		skeletonInner.className = 'skeleton__inner';
		skeletonPod.className = 'skeleton__text';
		skeletonEdit.className = 'skeleton__edit';
		skeletonFollow.className = 'skeleton__follow';
		skeletonSubmit.className = 'skeleton__submit';

		skeleton.appendChild(skeletonInner);
		skeletonInner.appendChild(skeletonPod);
		skeletonInner.appendChild(skeletonEdit);
		skeletonInner.appendChild(skeletonFollow);
		skeletonInner.appendChild(skeletonSubmit);
		commentsEl.parentNode.insertBefore(skeleton, commentsEl.nextSibling);
	}
}

module.exports = createSkeleton;
