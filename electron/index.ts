/* eslint-disable import/no-extraneous-dependencies */
// Native
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { sync } from 'glob';

// Packages
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron';
import ComfyJS from 'comfy.js';

import express from './express';
import Store from './store';

import { IGooseBerry, IModule, IData } from './interfaces';

const userPreferences = new Store({
	configName: 'user-preferences',
	defaults: JSON.parse(
		readFileSync(
			join(__dirname, '../resources/defaults/user-preferences.json')
		).toString()
	) as IData,
});

const modules: { [key: string]: IModule } = {};

const GooseBerry: IGooseBerry = {
	config: {
		userPreferences,
	},
	ComfyJS,
	devices: [],
	triggers: [],
	actions: [],
	rules: [
		{
			trigger: {
				device: 'twitch',
				type: 'redemption',
				id: '9c4df97c-1117-405d-8b0f-4bc1992bcf86',
			},
			action: {
				device: 'twitch',
				type: 'chat',
				id: '9c4df97c-1117-405d-8b0f-4bc1992bcf86',
				message: 'Hello {username}!',
			},
		},
	],
};

GooseBerry.ComfyJS.onConnected = () => {
	// Dynamically import all modules in the modules folder and run them
	sync(join(__dirname, 'modules/*.js')).forEach((file) => {
		const module = file.split('/').pop()?.split('.').shift() as string;
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		modules[module] = require(file) as IModule;
		modules[module].default(GooseBerry);
	});

	// Set StatusBar indicator to show if connected or not
	console.log('Connected!!');
};

GooseBerry.ComfyJS.Init(
	GooseBerry.config.userPreferences.get('TWITCH_BOT_USERNAME') as string,
	GooseBerry.config.userPreferences.get(
		'TWITCH_BOT_USER_ACCESS_TOKEN'
	) as string,
	[GooseBerry.config.userPreferences.get('TWITCH_BOT_CHANNEL') as string]
);

const height = 600;
const width = 800;

function createWindow() {
	// Create the browser window.
	const window = new BrowserWindow({
		width,
		height,
		minWidth: width,
		frame: true,
		show: true,
		resizable: true,
		fullscreenable: true,
		webPreferences: {
			preload: join(__dirname, 'preload.js'),
		},
	});

	const port = process.env.PORT || 3000;
	const url = !app.isPackaged
		? `http://localhost:${port}`
		: join(__dirname, '../src/out/index.html');

	// and load the index.html of the app.
	if (!app.isPackaged) {
		void window?.loadURL(url);
	} else {
		void window?.loadFile(url);
	}
	// Open the DevTools.
	// window.webContents.openDevTools();

	// For AppBar
	ipcMain.on('minimize', () => {
		if (window.isMinimized()) {
			window.restore();
		} else {
			window.minimize();
		}
	});

	ipcMain.on('maximize', () => {
		if (window.isMaximized()) {
			window.restore();
		} else {
			window.maximize();
		}
	});

	ipcMain.on('close', () => {
		window.close();
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
void app.whenReady().then(() => {
	express();
	createWindow();
	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: unknown) => {
	console.log('message', message);
	GooseBerry.ComfyJS.Say(
		`"${message as string}" triggered from Electron app...`,
		userPreferences.get('TWITCH_BOT_CHANNEL') as string
	);
	setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});

// Listen to ConfyJS events and send to renderer process
GooseBerry.ComfyJS.onCommand = (
	user: string,
	command: string,
	message: string
) => {
	console.log(`${user} used ${command} with message: ${message}`);
	BrowserWindow.getAllWindows()[0].webContents.send(
		'message',
		`${user} used ${command} with message: ${message}`
	);
};
