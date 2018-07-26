const {app, BrowserWindow, ipcMain, protocol} = require('electron');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const wallpaper = require('wallpaper');

protocol.registerStandardSchemes(['wallcutter']);

app.on('ready', async() => {
	const {screen} = require('electron');

	try {
		await promisify(fs.mkdir)(path.resolve('./data'));
	} catch(e) {}

	protocol.registerFileProtocol('wallcutter', (req, cb) => {
		const reqPath = req.url.replace(/^wallcutter:\/\/cropify\//, '').replace(/\?.*/, '').replace(/\#.*/, '');
		cb(path.resolve(__dirname, 'app', 'dist', reqPath));
	});

	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 720
	});
	mainWindow.setMenu(null);
	mainWindow.setResizable(false);
	mainWindow.loadURL('wallcutter://cropify/index.html');

	mainWindow.webContents.on('did-finish-load', () => {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		screen.getAllDisplays().forEach(display => {
			minX = Math.min(minX, display.bounds.x);
			minY = Math.min(minY, display.bounds.y);
			maxX = Math.max(maxX, display.bounds.x + display.bounds.width);
			maxY = Math.max(maxY, display.bounds.y + display.bounds.height);
		});

		mainWindow.webContents.send('screen-resolution', {
			width: maxX - minX,
			height: maxY - minY
		});
	});

	ipcMain.on('wallpaper', async (_, buff) => {
		const wallpaperPath = path.resolve('./data', 'wallpaper.png');

		await promisify(fs.writeFile)(wallpaperPath, buff);
		await wallpaper.set(wallpaperPath);

		mainWindow.webContents.send('wallpaper');
	});
});

app.on('window-all-closed', () => {
	app.quit();
});
