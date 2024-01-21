import { join } from 'node:path';
import express from 'express';

import GooseBerry from './gooseberry';

const overlayServer = (): void => {
	const overlay = express();
	overlay.use(
		// eslint-disable-next-line import/no-named-as-default-member
		express.static(join(__dirname, '../resources/overlays/'))
	);
	overlay.listen(GooseBerry.config.userPreferences.get('OVERLAY_PORT'), () => {
		console.log(
			`Overlay server listening on port ${GooseBerry.config.userPreferences.get('OVERLAY_PORT') as string}`
		);
	});
};

export { overlayServer };
