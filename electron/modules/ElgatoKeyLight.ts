//TODO: Fix all eslint-disable comments

import { default as Bonjour } from 'bonjour-service';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IGooseBerry } from '../interfaces';

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
	});

	// Actions
	GooseBerry.registerAction({
		id: 'eba7fba9-1b54-441b-aea1-89c0739fe329',
		device: 'Elgato',
		type: 'Turn Light On',
		callback: (options: { address: string; port: number }) => {
			void fetch(`http://${options.address}:${options.port}/elgato/lights`, {
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
		id: '41515174-8c18-4184-8996-e2e655bc24e5',
		device: 'Elgato',
		type: 'Turn Light Off',
		callback: (options: { address: string; port: number }) => {
			void fetch(`http://${options.address}:${options.port}/elgato/lights`, {
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
