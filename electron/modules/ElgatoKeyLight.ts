//TODO: Fix all eslint-disable comments

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IGooseBerry } from '../interfaces';

import dns from 'node:dns';

// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const bonjour = require('bonjour')();

//TODO: We need to figure out how to get the IP (IPV4) of the Elgato Key Light Air and use that to send the request.

export default (GooseBerry: IGooseBerry) => {
	bonjour.find({ type: 'elg' }).on('up', (service: any) => {
		try {
			dns.lookup(service.host as string, (error: any, address: string) => {
				if (error) throw error;
				void fetch(`http://${address}:${service.port}/elgato/lights`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						Lights: [
							{
								On: 1,
							},
						],
					}),
				});
			}); // Add closing parenthesis here
		} catch (error) {
			console.log('error', error);
		}

		// const light = lightData.data.lights[0];

		// {
		// 	method: 'PUT',
		// 	body: JSON.stringify({ Lights: [{ On: 1 }] }),
		// });

		console.log('up', service);
	});

	GooseBerry.ComfyJS.onCommand = (user, command, message, flags, extra) => {
		console.log('onCommand', user, command, message, flags, extra);
	};
};
