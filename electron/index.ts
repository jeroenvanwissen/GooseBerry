/* eslint-disable import/no-extraneous-dependencies */
// Native
import { join } from 'node:path';
import { sync } from 'glob';

// Packages
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, ipcMain } from 'electron';

// GooseBerry packages
import { IModule } from './interfaces';

import GooseBerry from './gooseberry';
import api from './api';

// import { apiServer, overlayServer } from './servers';

// Dynamically import all modules in the modules folder and run them when we connect to Twitch chat
const modules: { [key: string]: IModule } = {};
GooseBerry.ComfyJS.onConnected = () => {
	sync(join(__dirname, 'modules/*.js')).forEach((file) => {
		const module = file.split('/').pop()?.split('.').shift() as string;
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		modules[module] = require(file) as IModule;
		modules[module].default(GooseBerry);
	});
};

// Connect to Twitch chat
GooseBerry.ComfyJS.Init(
	GooseBerry.config.userPreferences.get('TWITCH_BOT_USERNAME') as string,
	GooseBerry.config.userPreferences.get(
		'TWITCH_BOT_USER_ACCESS_TOKEN'
	) as string,
	[GooseBerry.config.userPreferences.get('TWITCH_BOT_CHANNEL') as string]
);

// Application initialization
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

	GooseBerry.webContents = window.webContents;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
void app.whenReady().then(() => {
	api();
	// apiServer();
	// overlayServer();
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
