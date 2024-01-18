//TODO: Fix all eslint-disable comments

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IGooseBerry } from '../interfaces';

export default async (GooseBerry: IGooseBerry) => {
	//TODO Register device, add checks to prevent duplicates
	// GooseBerry.registerDevice(Twitch...);

	console.log('Loading Twitch');

	// Register Twitch Send Chat Message as Action type
	GooseBerry.registerAction({
		id: '07290497-5e49-4aad-aee6-23cc22b38c08',
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
		id: '0a44826f-5a30-4764-869c-d32aa9900d25',
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
				rule.trigger.id === '0a44826f-5a30-4764-869c-d32aa9900d25' &&
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
