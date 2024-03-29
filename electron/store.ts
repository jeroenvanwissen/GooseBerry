/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { join } from 'path';
import { readFileSync, writeFileSync } from 'node:fs';

// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron';

import { IData } from './interfaces';

const parseDataFile = (filePath: string, defaults: IData | []) => {
	try {
		return JSON.parse(readFileSync(filePath).toString()) as IData | [];
	} catch (error) {
		writeFileSync(filePath, JSON.stringify(defaults));
		return defaults;
	}
};

export default class Store {
	private path: string;

	private data: IData | [];

	constructor(opts: { configName: string; defaults: IData | [] }) {
		const userDataPath = app.getPath('userData');
		this.path = join(userDataPath, `${opts.configName}.json`);
		this.data = parseDataFile(this.path, opts.defaults);
	}

	get(key: string): string | number | boolean | unknown {
		return (<IData>this.data)[key];
	}

	set(key: string, val: unknown) {
		(<IData>this.data)[key] = val;
		writeFileSync(this.path, JSON.stringify(this.data));
	}

	// When we don't really need key/value storage but just full array of objects storage
	// Load array of objects from file
	load() {
		return JSON.parse(readFileSync(this.path).toString()) as [];
	}

	// Save array of objects to file
	save(data: []) {
		writeFileSync(this.path, JSON.stringify(data));
	}
}
