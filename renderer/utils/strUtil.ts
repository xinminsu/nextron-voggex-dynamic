export const string2ArrayBuffer = (str) => {
    return new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h,16)
    }))
};

export const toHexString = (bytes: Uint8Array): string => {
    return bytes.reduce((str: string, byte: number) => str + byte.toString(16).padStart(2, '0') + ' ', '');
};

export const ArraytoStringArray = (bytes: Array<any>): string[] => {
    var data = [];

    for (var i = 0; i < bytes.length; ++i) {
        data.push(bytes[i] +'');
    }
    return data;
}

export const Uint8ArraytoNumberArray = (bytes: Uint8Array): any[] => {
    var data = new Array();

    for (var i = 0; i < bytes.length; ++i) {
        data.push(bytes[i]);
    }
    return data;
}


