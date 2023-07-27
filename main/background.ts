import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import dgram from 'dgram';
import {localIP, localPort, remoteIP, remotePort} from "./utils/const";
import {generateAxis, getWaveLengthInfo} from "./utils/algorithm";
import {ArraytoStringArray, string2ArrayBuffer, Uint8ArraytoNumberArray} from "./utils/strUtil";

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

const spvwStringMsg = "30 07 06 00 00 00";
const spvwMsg = string2ArrayBuffer(spvwStringMsg.replaceAll(" ", ""));

const waveLengStringMsg = "30 02 06 00 00 00";
const waveLengMsg = string2ArrayBuffer(waveLengStringMsg.replaceAll(" ", ""));
let showWaveIntervId;

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
      mainWindow.webContents.send("wave-length-show",
          `${getWaveLengthInfo(rawBufferU8A)}`);
      rawTotalBuffer = Buffer.alloc(0);
    }
    if ( rawBufferU8A.length == 4101) {
      mainWindow.webContents.send("spectral-view-show",
          `{"content":[[${ArraytoStringArray(generateAxis())}],[${Uint8ArraytoNumberArray(rawBufferU8A)}]]}`);
      rawTotalBuffer = Buffer.alloc(0);
    }
  });


})();

app.on('window-all-closed', () => {
  udpSocket.close();
  app.quit();
});

ipcMain.on('spectral-view-start', (event, arg) => {
  if(!showWaveIntervId){
    showWaveIntervId = setInterval(
        () => {
          if(showWaveIntervId)
            udpSocket.send(spvwMsg, remotePort, remoteIP);
        }, 4000);
  }
});

ipcMain.on('spectral-view-stop', (event, arg) => {
  clearInterval(showWaveIntervId);
  showWaveIntervId = null;
});

ipcMain.on('get-wave-length', (event, arg) => {
  udpSocket.send(waveLengMsg, remotePort, remoteIP);
});
