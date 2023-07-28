
export const getWaveLengthInfo = (recvData: Uint8Array): string => {
    let m: number = 8;
    let wlData: number[][] = [];
    for (let i: number = 0; i < m; i++) {
        wlData[i] = [];
    }

    for (let i = 0; i < 8; i++)
    {
        for (let j = 0; j < 30; j++)
        {
            wlData[i][j] = ((recvData[i * 151 + j * 5 + 3] & 0xff) << 16 | (recvData[i * 151 + j * 5 + 4] & 0xff) << 8 | (recvData[i * 151 + j * 5 + 5] & 0xff) ) / 1000.0;
            if (wlData[i][j]!=0)
            {
                wlData[i][j] = (wlData[i][j] - 1527.000) * 4;
                wlData[i][j] = wlData[i][j] + 1527.000;
            }
            else {
                wlData[i][j] = 0.0;
            }
        }
    }

    let result:string = '';
    for (let i = 0; i < 8; i++)
    {
        let resulti = '通道' + (i + 1) + ": ";
        for (let j = 0; j < 30; j++) {
            resulti += wlData[i][j].toFixed(3) + ' ';
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
