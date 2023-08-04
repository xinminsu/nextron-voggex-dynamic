
export const getWaveLengthData = (recvData: Uint8Array): number[][] => {
    let m: number = 8;
    let wlData: number[][] = [];
    for (let i: number = 0; i < m; i++) {
        wlData[i] = [];
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 30; j++) {
            wlData[i][j] = ((recvData[i * 151 + j * 5 + 3] & 0xff) << 16 | (recvData[i * 151 + j * 5 + 4] & 0xff) << 8 | (recvData[i * 151 + j * 5 + 5] & 0xff)) / 1000.0;
            if (wlData[i][j] != 0) {
                wlData[i][j] = (wlData[i][j] - 1527.000) * 4;
                wlData[i][j] = wlData[i][j] + 1527.000;
            } else {
                wlData[i][j] = 0.0;
            }
        }
    }
    return wlData;
}




