/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import {
  app,
  BrowserWindow,
  session,
  OnBeforeSendHeadersDetails
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

interface RequestHeaders {
  Origin: string;
  Referer: string;
  'User-Agent': string;
}

interface HeaderDetails extends OnBeforeSendHeadersDetails {
  requestHeaders: RequestHeaders;
}

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024 + 80,
    height: 720,
    titleBarStyle: 'hiddenInset',
    frame: false
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  if (session.defaultSession) {
    session.defaultSession.webRequest.onBeforeSendHeaders(
      { urls: [] },
      (details_: OnBeforeSendHeadersDetails, callback) => {
        const details = details_ as HeaderDetails;

        if (/hamreus/.test(details.url)) {
          details.requestHeaders.Referer = 'https://tw.manhuagui.com/';
        }

        if (/m\.manhuagui\.com/.test(details.url)) {
          details.requestHeaders['User-Agent'] =
            '"Mozilla/5.0 (Linux; Android 7.0;) Chrome/58.0.3029.110 Mobile")';
        }

        callback({
          cancel: false,
          requestHeaders: details.requestHeaders
        });
      }
    );
  }

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
