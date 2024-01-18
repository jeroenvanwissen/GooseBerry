/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { ComfyJSInstance } from 'comfy.js';

interface IComfyJS extends ComfyJSInstance {
	GetChannelRewards?: (clientId: string, manageableOnly?: boolean) => any;
}

type TCallback<T extends any[]> = (...args: T) => void;

export interface IAction {
	id: string;
	device: string;
	type: string;
	callback: TCallback<any[]>;
}

export interface ITrigger {
	id: string;
	device: string;
	type: string;
}

export interface IRule {
	trigger: {
		id: string;
	};
	action: {
		id: string;
	};
	[key: string]: any;
}

export interface IGooseBerry {
	config: {
		userPreferences: {
			get: (key: string) => string | number | boolean | unknown;
		};
	};
	ComfyJS: IComfyJS;
	triggers: ITrigger[];
	actions: IAction[];
	devices: object[];
	rules: IRule[];
	registerAction: (...args: IAction[]) => void;
	registerTrigger: (...args: ITrigger[]) => void;
	registerRule: (trigger: string, action: string, options: {}) => void;
}

export interface IModule {
	default: (gooseberry: IGooseBerry) => void;
}

export interface IData {
	[key: string]: string | number | boolean | unknown;
}
