import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import dgram from 'dgram';
import {localPort, remoteIP, remotePort} from "./utils/const";
import { getWaveLengthData} from "./utils/algorithm";
import {string2ArrayBuffer, Uint8ArraytoNumberArray} from "./utils/strUtil";
import {spvwMsg, spvwStringMsg, spvwStringMsgArray, waveLengthMsg} from "./message/voggexMessage";
import Store from "electron-store";

const store = new Store();

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let udpSocket;
const createSocket = () => {
  const socket = dgram.createSocket('udp4');
  return new Promise((resolve, reject) => {
    socket.bind(localPort, () => {
      udpSocket = socket;
      resolve(socket);
    });
  })
}
let rawTotalBuffer: Buffer = Buffer.alloc(0);
let rawBufferU8A:Uint8Array;

let spectralViewContinue = false;
let waveLengthContinue = false;
let oneSpectralViewContinue = false;

let curChannel = 0;
let oneChannelId = 0;

(async () => {
  await app.whenReady();

  await createSocket();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  udpSocket.on('message', (msg, rinfo) => {
    rawTotalBuffer = Buffer.concat([rawTotalBuffer, msg]);
    rawBufferU8A = new Uint8Array(rawTotalBuffer);
    //console.log("recv raw hex msg length is " + rawBufferU8A.length);
    if (rawBufferU8A.length == 1208) {
      if (waveLengthContinue) {
        let wlData = getWaveLengthData(rawBufferU8A);
        mainWindow.webContents.send("wave-length-show",
            wlData);
        udpSocket.send(waveLengthMsg, remotePort, remoteIP);
      }
      rawTotalBuffer = Buffer.alloc(0);
    }
    if ( rawBufferU8A.length == 4101) {
      if(spectralViewContinue && !oneSpectralViewContinue){
        //console.log(" channelId = " + curChannel);
        mainWindow.webContents.send("spectral-view-show",
            `{"channelId":${curChannel},"content":[${Uint8ArraytoNumberArray(rawBufferU8A)}]}`);
        curChannel ++;
        curChannel = curChannel % 8;
        let curSpvwMsg = string2ArrayBuffer(spvwStringMsgArray[curChannel].replaceAll(" ", ""));
        udpSocket.send(curSpvwMsg, remotePort, remoteIP);
      }
      if (oneSpectralViewContinue && !spectralViewContinue) {
        //console.log(" oneChannelId = " + oneChannelId);
        mainWindow.webContents.send("one-spectral-view-show",
            `{"content":[${Uint8ArraytoNumberArray(rawBufferU8A)}]}`);
        let curOneSpvwMsg = string2ArrayBuffer(spvwStringMsgArray[oneChannelId].replaceAll(" ", ""));
        udpSocket.send(curOneSpvwMsg, remotePort, remoteIP);
      }
      rawTotalBuffer = Buffer.alloc(0);
    }
  });


})();

app.on('window-all-closed', () => {
  udpSocket.close();
  app.quit();
});

ipcMain.on('one-spectral-view-start', (event, arg) => {
  console.log("ipcMain one-spectral-view-start " + arg );
  oneChannelId = arg;
  spectralViewContinue = false;
  waveLengthContinue = false;
  oneSpectralViewContinue = true;
  let curOneSpvwMsg = string2ArrayBuffer(spvwStringMsgArray[oneChannelId].replaceAll(" ", ""));
  udpSocket.send(curOneSpvwMsg, remotePort, remoteIP);
});

ipcMain.on('one-spectral-view-stop', (event, arg) => {
  oneSpectralViewContinue = false;
});

ipcMain.on('spectral-view-start', (event, arg) => {
  console.log("ipcMain spectral-view-start " );
  spectralViewContinue = true;
  oneSpectralViewContinue = false;
  curChannel = 0;
  udpSocket.send(spvwMsg, remotePort, remoteIP);
});

ipcMain.on('voggex-stop', (event, arg) => {
  console.log("ipcMain voggex-stop " );
  spectralViewContinue = false;
  waveLengthContinue = false;
  oneSpectralViewContinue = false;
});

ipcMain.on('get-wave-length', (event, arg) => {
  console.log("ipcMain get-wave-length " );
  waveLengthContinue = true;
  spectralViewContinue = false;
  oneSpectralViewContinue = false;
  udpSocket.send(waveLengthMsg, remotePort, remoteIP);
});

ipcMain.on('udp-config', (event, arg) => {
  spectralViewContinue = false;
});

/*ipcMain.on('get-udpUIType', (event, arg) => {
  event.returnValue = store.get('udpUIType');
});

ipcMain.on('set-udpUIType', (event, arg) => {
  store.set('udpUIType',arg);
});*/
