export const ArraytoStringArray = (bytes: Array<any>): string[] => {
    var data = [];

    for (var i = 0; i < bytes.length; ++i) {
        data.push(bytes[i] +'');
    }
    return data;
}
