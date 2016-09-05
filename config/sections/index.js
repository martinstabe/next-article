import pyramidTrioSection from './pyramid-trio';

import layouts from '../layouts';

const sections = {
	'pyramid-trio': pyramidTrioSection,
};

export default (sectionId, data, flags, opts = {}) => {
	const section = sections[sectionId](opts.name, opts.trackScrollEvent);
	const layout = layouts[section.layoutId](opts.name);
	return Object.assign({}, section, { data, layout, flags });
}
