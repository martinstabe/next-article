const INTENT_ENTER = 300;
const INTENT_LEAVE = 400;

export default function intent (target, callbackIn, callbackOut) {
	let timeout;

	target.addEventListener('mouseenter', () => {
		clearTimeout(timeout);
		timeout = setTimeout(callbackIn, INTENT_ENTER);
	});

	target.addEventListener('mouseleave', () => {
		clearTimeout(timeout);
		timeout = setTimeout(callbackOut, INTENT_LEAVE);
	});
}
