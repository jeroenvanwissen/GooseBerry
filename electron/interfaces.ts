/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { ComfyJSInstance } from 'comfy.js';

interface IComfyJS extends ComfyJSInstance {
	GetChannelRewards?: (clientId: string, manageableOnly?: boolean) => any;
}

export interface IGooseBerry {
	config: {
		userPreferences: {
			get: (key: string) => string | number | boolean | unknown;
		};
	};
	ComfyJS: IComfyJS;
	triggers: object[];
	actions: {
		id: string;
		device: string;
		actionType: string;
		action: (message: string, username: string) => void;
	}[];
	devices: object[];
	rules: {
		trigger: {
			device: string;
			type: string;
			id: string;
		};
		action: {
			device: string;
			type: string;
			id: string;
			message: string;
		};
	}[];
}

export interface IModule {
	default: (gooseberry: IGooseBerry) => void;
}

export interface IData {
	[key: string]: string | number | boolean | unknown;
}
