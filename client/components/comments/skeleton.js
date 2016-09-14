const createSkeleton = {
	init: function () {
		const skeleton = document.createElement('div');
		const skeletonInner = document.createElement('div');
		const skeletonAvatar = document.createElement('div');
		const skeletonPod = document.createElement('div');
		const commentsEl = document.querySelector('#comments');

		skeleton.className = 'skeleton';
		skeleton.setAttribute('data-skeleton', 'comments');
		skeletonInner.className = 'skeleton__inner';
		skeletonAvatar.className = 'skeleton__avatar';
		skeletonPod.className = 'skeleton__text';

		skeletonInner.appendChild(skeletonAvatar);
		skeletonInner.appendChild(skeletonPod);
		skeleton.innerHTML += skeletonInner.outerHTML;
		skeleton.innerHTML += skeletonInner.outerHTML;
		skeleton.innerHTML += skeletonInner.outerHTML;
		commentsEl.parentNode.insertBefore(skeleton, commentsEl.nextSibling);
	}
}

module.exports = createSkeleton;
