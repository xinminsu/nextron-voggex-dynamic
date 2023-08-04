import axios from "axios";

export const addWaveLengthToDb = async (wlData: number[][]) => {
    for (let i = 0; i < 8; i++)
    {
        for (let j = 0; j < 30; j++) {
            if(wlData[i][j] > 0.01) {
                let waveLength = {
                    channelId : i,
                    index: j,
                    value: wlData[i][j],
                };
                await axios.post("/api/wave", waveLength);
            }
        }
    }
}

export const getWaveLengthInfo = (wlData: number[][]): string => {
    let result:string = '';
    for (let i = 0; i < 8; i++)
    {
        let resulti = '通道' + (i + 1) + ": ";
        for (let j = 0; j < 30; j++) {
            if(wlData[i][j] > 0.01) {
                resulti += wlData[i][j].toFixed(3) + ' ';
            }
        }
        result += resulti + "\n"
    }

    return result
}

export const generateAxis = (): Array<any> => {
    let axis = new Array(4101);
    for (let i = 0; i < 4101; i++)
    {
        axis[i] = 1527 + i * 0.01;
    }
    return axis;
}
