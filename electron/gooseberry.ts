import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import ComfyJS from 'comfy.js';

import Store from './store';
import { IGooseBerry, ITrigger, IAction, IData } from './interfaces';

// Load/Initialize data stores
const userPreferences = new Store({
	configName: 'user-preferences',
	defaults: JSON.parse(
		readFileSync(
			join(__dirname, '../resources/defaults/user-preferences.json')
		).toString()
	) as IData,
});

const rulesStore = new Store({
	configName: 'rules',
	defaults: JSON.parse(
		readFileSync(join(__dirname, '../resources/defaults/rules.json')).toString()
	) as [],
});

const GooseBerry: IGooseBerry = {
	config: {
		userPreferences,
	},
	ComfyJS,
	redemptions: [],
	devices: [],
	triggers: [],
	actions: [],
	rules: rulesStore.load(),
	registerAction: ({ id, device, type, callback }: IAction) => {
		//TODO Add check if action already exists ( based on ID )
		GooseBerry.actions.push({ id, device, type, callback });
	},
	registerRule: (trigger: string, action: string, options: {}) => {
		GooseBerry.rules.push({
			trigger: {
				id: trigger,
			},
			action: {
				id: action,
			},
			options,
		});
		rulesStore.save(GooseBerry.rules as []);
		//TODO Register rule should store the rules in rules.json
	},
	registerTrigger: ({ id, device, type, options }: ITrigger) => {
		//TODO Add check if trigger already exists ( based on ID )
		GooseBerry.triggers.push({ id, device, type, options });
	},
	webContents: null,
};

export default GooseBerry;
