import onwardJourney from './onward-journey';

import layouts from '../layouts';

const sections = {
	'onward-journey': onwardJourney,
};

export default (sectionId, data, flags, opts = {}) => {
	const section = sections[sectionId](opts.name, opts.trackScrollEvent);
	const layout = layouts[section.layoutId](opts.name);
	return Object.assign({}, section, { data, layout, flags });
}
