import { app, BrowserWindow, session } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import os from 'os';

if (isDev) {
	require('electron-reload');
}

const createWindow = async () => {
	// create the browser window.
	let win = new BrowserWindow({
		width: 1200,
		height: 1200,
		webPreferences: {
			nodeIntegration: true,
		}
	});

	win.loadURL(
		isDev
		? 'http://localhost:8080'
		: `file://${path.join(__dirname, '../build/index.html')}`,
	);

	if (isDev) {
		// open the DevTools.
		win.webContents.openDevTools();
		// load extensions
		let extensionPath = '/Library/Application Support/Google/Chrome/Profile 1/Extensions/';
		// redux devtools
		await session.defaultSession.loadExtension(
			path.join(os.homedir(), extensionPath + 'lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
		);
		// react devtools
		await session.defaultSession.loadExtension(
			path.join(os.homedir(), extensionPath + 'fmkadmapgofadopljbjfkapdkoienihi/4.7.0_7')
		);
	}
};

// connect API
require('../src/main-renderer/api/connect');
// lights API
require('../src/main-renderer/api/lights');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
});

// load up the session storage
// check to see if the user has a account/connection already
// no go to the setup

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.