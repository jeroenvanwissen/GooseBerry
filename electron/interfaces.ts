/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { ComfyJSInstance, Reward } from 'comfy.js';

// Extend ComfyJS interface with GetChannelRewards, CreateChannelReward, UpdateChannelReward, DeleteChannelReward definitions
interface IComfyJS extends ComfyJSInstance {
	GetChannelRewards?: (
		clientId: string,
		manageableOnly?: boolean
	) => Promise<Reward[]>;
	CreateChannelReward?: (
		clientId: string,
		rewardInfo: Reward
	) => Promise<Reward>;
	UpdateChannelReward?: (
		clientId: string,
		rewardId: string,
		rewardInfo: Reward
	) => Promise<Reward>;
	//TODO figure out what the return type is for DeleteChannelReward
	DeleteChannelReward?: (clientId: string, rewardId: string) => Promise<[]>;
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
	options?: {
		[key: string]: any;
	};
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
	redemptions: object[];
	triggers: ITrigger[];
	actions: IAction[];
	devices: object[];
	rules: IRule[];
	registerAction: (...args: IAction[]) => void;
	registerTrigger: (...args: ITrigger[]) => void;
	registerRule: (trigger: string, action: string, options: {}) => void;
	webContents: any;
}

export interface IModule {
	default: (gooseberry: IGooseBerry) => void;
}

export interface IData {
	[key: string]: string | number | boolean | unknown;
}
