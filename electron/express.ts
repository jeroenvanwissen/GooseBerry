import { join } from 'node:path';
import { readFileSync } from 'node:fs';

import express from 'express';

import Store from './store';

import { IData } from './interfaces';

const config = new Store({
	configName: 'user-preferences',
	defaults: JSON.parse(
		readFileSync(
			join(__dirname, '../resources/defaults/user-preferences.json')
		).toString()
	) as IData,
});

export default (): void => {
	const expressServer = express();

	expressServer.use(
		// eslint-disable-next-line import/no-named-as-default-member
		express.static(join(__dirname, '../resources/overlays/'))
	);
	expressServer.listen(config.get('OVERLAY_PORT'), () => {
		console.log(
			`Overlay server listening on port ${config.get('OVERLAY_PORT') as string}`
		);
	});
};
