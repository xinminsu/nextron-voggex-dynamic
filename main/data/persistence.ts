/*import Store, { Schema } from 'electron-store';

interface MainPersistence {
    udpMsgOperation: 'none' | 'OneSpectralView' | 'AllSpectralView' | 'WaveLength';
}


const schema: Schema<MainPersistence> = {
    udpMsgOperation: {
        type: 'string',
        // @ts-ignore
        enum: ['none' | 'OneSpectralView' | 'AllSpectralView' | 'WaveLength'],
        default: 'none',
    },
}

export const store = new Store<MainPersistence>({ schema });*/

export enum UdpUIType {
    None,
    OneSpectralView,
    AllSpectralView,
    WaveLength,
}

