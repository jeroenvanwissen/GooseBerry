//TODO: Fix all eslint-disable comments

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IGooseBerry } from '../interfaces';

export default async (GooseBerry: IGooseBerry) => {
	let channelRewards = [];
	try {
		if (GooseBerry.ComfyJS.GetChannelRewards) {
			channelRewards = await GooseBerry.ComfyJS.GetChannelRewards(
				GooseBerry.config.userPreferences.get('TWITCH_BOT_CLIENT_ID') as string,
				false
			);
		}
	} catch (error) {
		console.log('error', error);
	}

	//TODO: Parse the channelRewards array and make sure all data is put in the correct format for the frontend.
	console.log('channelRewards 1', channelRewards);

	GooseBerry.ComfyJS.onReward = (user, reward, cost, message, extra) => {
		GooseBerry.rules.find((rule) => {
			if (rule.trigger.type === 'redemption') {
				if (rule.trigger.id === extra.reward.id) {
					GooseBerry.actions.find((action) => {
						if (action.id === rule.action.id) {
							action.action(rule.action.message, user);
						}
					});
				}
			}
		});
		console.log('onReward', user, reward, cost, message, extra);
	};
};
