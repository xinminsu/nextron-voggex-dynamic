import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import dgram from 'dgram';
import {localPort, remoteIP, remotePort} from "./utils/const";
import {generateAxis, getWaveLengthInfo} from "./utils/algorithm";
import {ArraytoStringArray, string2ArrayBuffer, Uint8ArraytoNumberArray} from "./utils/strUtil";
import {spvwMsg, spvwStringMsg, spvwStringMsgArray, waveLengthMsg} from "./message/voggexMessage";

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

let curChannel = 0;

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
        mainWindow.webContents.send("wave-length-show",
            `${getWaveLengthInfo(rawBufferU8A)}`);
        udpSocket.send(waveLengthMsg, remotePort, remoteIP);
      }
      rawTotalBuffer = Buffer.alloc(0);
    }
    if ( rawBufferU8A.length == 4101) {
      if(spectralViewContinue){
        mainWindow.webContents.send("spectral-view-show",
            `{"channelId":${curChannel},"content":[[${ArraytoStringArray(generateAxis())}],[${Uint8ArraytoNumberArray(rawBufferU8A)}]]}`);
        curChannel ++;
        curChannel = curChannel % 4;
        let curSpvwMsg = string2ArrayBuffer(spvwStringMsgArray[curChannel].replaceAll(" ", ""));
        udpSocket.send(curSpvwMsg, remotePort, remoteIP);
      }
      rawTotalBuffer = Buffer.alloc(0);
    }
  });


})();

app.on('window-all-closed', () => {
  udpSocket.close();
  app.quit();
});

ipcMain.on('spectral-view-start', (event, arg) => {
  console.log("ipcMain spectral-view-start " );
  spectralViewContinue = true;
  udpSocket.send(spvwMsg, remotePort, remoteIP);
});

ipcMain.on('voggex-stop', (event, arg) => {
  console.log("ipcMain voggex-stop " );
  spectralViewContinue = false;
  waveLengthContinue = false;
});

ipcMain.on('get-wave-length', (event, arg) => {
  console.log("ipcMain get-wave-length " );
  waveLengthContinue = true;
  udpSocket.send(waveLengthMsg, remotePort, remoteIP);
});
