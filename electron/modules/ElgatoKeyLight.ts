//TODO: Fix all eslint-disable comments

import { default as Bonjour } from 'bonjour-service';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IGooseBerry } from '../interfaces';
import { ACTION_ELGATO_LIGHT_OFF, ACTION_ELGATO_LIGHT_ON } from '../uuids';

//TODO: We need to figure out how to get the IP (IPV4) of the Elgato Key Light Air and use that to send the request.

interface IService {
	addresses: string[];
	subtypes: string[];
	name: string;
	fqdn: string;
	host: string;
	referer: {
		address: string;
		family: string;
		port: number;
		size: number;
	};
	port: number;
	type: string;
	protocol: string;
	rawTxt: Buffer[];
	txt: {};
}

export default (GooseBerry: IGooseBerry) => {
	const devices: IService[] = [];

	const instance = new Bonjour();

	instance.find({ type: 'elg' }).on('up', (service: IService) => {
		devices.push(service);
		// console.log('devices', devices);

		//TODO Register device, add checks to prevent duplicates
		// GooseBerry.registerDevice();
		// GooseBerry.registerDevice(EGLATO_DEVICE_ID, 'Elgato'); ?? What is we have multiple Elgato devices?
		// Bonjour doesn't give us a unique ID for the device, so we can't use that.
	});

	// Actions
	GooseBerry.registerAction({
		id: ACTION_ELGATO_LIGHT_ON,
		device: 'Elgato',
		type: 'Turn Light On',
		callback: (device: { address: string; port: number }) => {
			void fetch(`http://${device.address}:${device.port}/elgato/lights`, {
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
		},
	});

	GooseBerry.registerAction({
		id: ACTION_ELGATO_LIGHT_OFF,
		device: 'Elgato',
		type: 'Turn Light Off',
		callback: (device: { address: string; port: number }) => {
			void fetch(`http://${device.address}:${device.port}/elgato/lights`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					Lights: [
						{
							On: 0,
						},
					],
				}),
			});
		},
	});
};
