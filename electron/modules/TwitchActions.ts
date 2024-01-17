//TODO: Fix all eslint-disable comments

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IGooseBerry } from '../interfaces';

export default (GooseBerry: IGooseBerry) => {
	GooseBerry.actions.push({
		id: '9c4df97c-1117-405d-8b0f-4bc1992bcf86',
		device: 'twitch',
		actionType: 'Send Chat Message as Broadcaster',
		action: (message: string, username: string) => {
			GooseBerry.ComfyJS.Say(
				message.replace('{username}', username),
				GooseBerry.config.userPreferences.get('TWITCH_BOT_CHANNEL') as string
			);
		},
	});

	GooseBerry.ComfyJS.onCommand = (user, command, message, flags, extra) => {
		GooseBerry.rules.find((rule) => {
			if (rule.trigger.type === 'command') {
				if (rule.trigger.id === command) {
					GooseBerry.actions.find((action) => {
						if (action.id === rule.action.id) {
							action.action(rule.action.message, user);
						}
					});
				}
			}
		});
		console.log('onCommand', user, command, message, flags, extra);
	};
};
