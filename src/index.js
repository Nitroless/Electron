'use strict';

const glasstron = require('glasstron');
const electron = require('electron');
const trayWindow = require('electron-tray-window');
const path = require('path');

electron.app.commandLine.appendSwitch('enable-transparent-visuals');
electron.app.commandLine.appendSwitch('disable-site-isolation-trials');

require('events').defaultMaxListeners = 15;

electron.app.on('ready', () => {
	let window = createWindow();
	let tray = new electron.Tray(path.join(__dirname, 'tray-icon.png'));
	setTimeout(() => {
		trayWindow.setOptions({
			tray: tray,
			window: window,
			margin_x: -200,
			margin_y: 30
		});
		const contextMenu = electron.Menu.buildFromTemplate([
			{
				label: 'Show App',
				click: function () {
					window.show();
				}
			},
			{
				label: 'Quit',
				click: function () {
					let display = electron.screen.getPrimaryDisplay();
					let width = display.bounds.width;
					let height = display.bounds.height;
					const win = new glasstron.BrowserWindow({
						width: 300,
						height: 200,
						x: width - 450,
						y: -height,
						backgroundColor: '#00000000',
						title: 'Quit Nitroless?',
						autoHideMenuBar: true,
						frame: false,
						show: true,
						blur: true,
						blurType: 'acrylic',
						blurGnomeSigma: 100,
						vibrancy: 'fullscreen-ui',
						icon: __dirname + '/app-icon.jpg',
						skipTaskbar: true,
						webPreferences: {
							nodeIntegration: true,
							contextIsolation: false
						}
					});
					win.webContents.loadURL(
						`file://${__dirname}/promptUser/quitApp.html`
					);
				}
			}
		]);
		tray.setToolTip('Nitroless');
		tray.setContextMenu(contextMenu);
	}, 1000);
});

function createWindow() {
	const win = new glasstron.BrowserWindow({
		width: 400,
		height: 600,
		backgroundColor: '#00000000',
		title: 'Nitroless',
		autoHideMenuBar: true,
		frame: false,
		show: false,
		blur: true,
		blurType: 'blurbehind',
		blurGnomeSigma: 100,
		vibrancy: 'fullscreen-ui',
		icon: __dirname + '/app-icon.jpg',
		skipTaskbar: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false
		}
	});

	win.webContents.loadURL(`file://${__dirname}/index.html`);

	if (process.platform === 'linux') {
		win.on('resize', () => {
			win.webContents.send('maximized', !win.isNormal());
		});
	}

	win.on('ready-to-show', () => {
		if (process.platform === 'linux')
			win.webContents.send('maximized', !win.isNormal());
		if (process.platform === 'win32' && win.getDWM().supportsAcrylic()) {
			acrylicWorkaround(win, 60);
			win.webContents.send('supportsAcrylic');
		}
	});

	if (process.platform === 'win32') {
		electron.ipcMain.on('blurTypeChange', (e, value) => {
			const win = electron.BrowserWindow.fromWebContents(e.sender);
			if (win !== null) {
				win.blurType = value;
				e.sender.send('blurTypeChanged', win.blurType);
			}
		});
	}

	electron.ipcMain.on('blurToggle', async (e, value) => {
		const win = electron.BrowserWindow.fromWebContents(e.sender);
		if (win !== null) {
			await win.setBlur(value);
			e.sender.send('blurStatus', await win.getBlur());
		}
	});

	electron.ipcMain.on('blurQuery', async (e) => {
		e.sender.send('blurStatus', await win.getBlur());
	});

	electron.ipcMain.on('exit', () => {
		electron.app.exit(0);
	});

	electron.ipcMain.on('close', () => {
		electron.app.quit();
	});

	electron.ipcMain.on('minimize', (e) => {
		const win = electron.BrowserWindow.fromWebContents(e.sender);
		win.hide();
	});

	electron.ipcMain.on('wmQuery', async (e) => {
		if (process.platform !== 'linux') return;
		e.sender.send(
			'wmString',
			await glasstron.getPlatform()._getXWindowManager()
		);
	});

	electron.ipcMain.on('gnomeSigma', async (e, res) => {
		if (process.platform !== 'linux') return;
		if ((await glasstron.getPlatform()._getXWindowManager()) !== 'GNOME Shell')
			return;
		win.blurGnomeSigma = res;
	});

	electron.ipcMain.on('show-context-menu', (e, res) => {
		const template = [
			{
				label: 'Remove Repo',
				click: () => {
					e.sender.send('removeRepo', res);
				}
			}
		];
		const menu = electron.Menu.buildFromTemplate(template);
		menu.popup(electron.BrowserWindow.fromWebContents(e.sender));
	});

	return win;
}

function acrylicWorkaround(win, pollingRate = 60) {
	// Replace window moving behavior to fix mouse polling rate bug
	win.on('will-move', (e) => {
		if (win.blurType !== 'acrylic') return;

		e.preventDefault();

		// Track if the user is moving the window
		if (win._moveTimeout) clearTimeout(win._moveTimeout);

		win._moveTimeout = setTimeout(() => {
			win._isMoving = false;
			clearInterval(win._moveInterval);
			win._moveInterval = null;
		}, 1000 / pollingRate);

		// Start new behavior if not already
		if (!win._isMoving) {
			win._isMoving = true;
			if (win._moveInterval) return false;

			// Get start positions
			win._moveLastUpdate = 0;
			win._moveStartBounds = win.getBounds();
			win._moveStartCursor = electron.screen.getCursorScreenPoint();

			// Poll at (refreshRate * 10) hz while moving window
			win._moveInterval = setInterval(() => {
				const now = Date.now();
				if (now >= win._moveLastUpdate + 1000 / pollingRate) {
					win._moveLastUpdate = now;
					const cursor = electron.screen.getCursorScreenPoint();

					// Set new position
					win.setBounds({
						x: win._moveStartBounds.x + (cursor.x - win._moveStartCursor.x),
						y: win._moveStartBounds.y + (cursor.y - win._moveStartCursor.y),
						width: win._moveStartBounds.width,
						height: win._moveStartBounds.height
					});
				}
			}, 1000 / (pollingRate * 10));
		}
	});

	// Replace window resizing behavior to fix mouse polling rate bug
	win.on('will-resize', (e) => {
		if (win.blurType !== 'acrylic') return;

		const now = Date.now();
		if (!win._resizeLastUpdate) win._resizeLastUpdate = 0;

		if (now >= win._resizeLastUpdate + 1000 / pollingRate)
			win._resizeLastUpdate = now;
		else e.preventDefault();
	});
}
