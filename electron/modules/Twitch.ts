//TODO: Fix all eslint-disable comments

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IGooseBerry } from '../interfaces';
import {
	ACTION_TWITCH_SEND_MESSAGE,
	TRIGGER_TWITCH_CHAT_COMMAND,
} from '../uuids';

export default async (GooseBerry: IGooseBerry) => {
	// GooseBerry.registerDevice(TWITCH_DEVICE_ID, 'Twitch');

	// Register Twitch Send Chat Message as Action type
	GooseBerry.registerAction({
		id: ACTION_TWITCH_SEND_MESSAGE,
		device: 'Twitch',
		type: 'Send Chat Message as Broadcaster',
		callback: (options: { message: string }, data: { user: string }) => {
			GooseBerry.ComfyJS.Say(
				//TODO: Variable replacing in the message should be refactored into something more dynamic.
				//      The data object can contain AL LOT of things...
				options.message.replace('#{user}', data.user),
				GooseBerry.config.userPreferences.get('TWITCH_BOT_CHANNEL') as string
			);
			console.log('Send Chat Message as Broadcaster');
		},
	});

	// Register Twitch Chat Command as Trigger type
	GooseBerry.registerTrigger({
		id: TRIGGER_TWITCH_CHAT_COMMAND,
		device: 'Twitch',
		type: 'Command',
	});

	// Get Twitch Channel Rewards
	let channelRewards = [];
	try {
		if (GooseBerry.ComfyJS.GetChannelRewards) {
			channelRewards = await GooseBerry.ComfyJS.GetChannelRewards(
				GooseBerry.config.userPreferences.get('TWITCH_BOT_CLIENT_ID') as string,
				false
			);
			channelRewards.forEach((reward: any) => {
				//TODO: Maybe extend the trigger object to add more properties like cost, etc.
				GooseBerry.registerTrigger({
					id: reward.id,
					device: 'Twitch',
					type: reward.title,
				});
			});
		}
	} catch (error) {
		console.log('error', error);
	}

	// Twitch Chat Command Trigger
	GooseBerry.ComfyJS.onCommand = (
		user: string,
		command: string,
		message: string
	) => {
		console.log('onCommand');
		GooseBerry.rules.find((rule) => {
			if (
				rule.trigger.id === TRIGGER_TWITCH_CHAT_COMMAND &&
				rule.options.command === command
			) {
				GooseBerry.actions.find((action) => {
					if (action.id === rule.action.id) {
						action.callback(rule.options, {
							user,
							command,
							message,
						});
					}
				});
			}
		});
	};

	// Twitch Rewards Trigger
	GooseBerry.ComfyJS.onReward = (user, reward, cost, message, extra) => {
		console.log('onReward');
		GooseBerry.rules.find((rule) => {
			if (rule.trigger.id === extra.reward.id) {
				GooseBerry.actions.find((action) => {
					if (action.id === rule.action.id) {
						action.callback(rule.options, {
							user,
							reward,
							cost,
							message,
							extra,
						});
					}
				});
			}
		});
	};
};
