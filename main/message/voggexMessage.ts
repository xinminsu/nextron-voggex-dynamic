import {string2ArrayBuffer} from "../utils/strUtil";

export const spvwStringMsg = "30 07 06 00 00 00";
export const spvwMsg = string2ArrayBuffer(spvwStringMsg.replaceAll(" ", ""));

export const waveLengthStringMsg = "30 02 06 00 00 00";
export const waveLengthMsg = string2ArrayBuffer(waveLengthStringMsg.replaceAll(" ", ""));

export const spvwStringMsgArray = ["30 07 06 00 00 00","30 07 06 00 00 01",
    "30 07 06 00 00 02","30 07 06 00 00 03","30 07 06 00 00 04","30 07 06 00 00 05",
    "30 07 06 00 00 06","30 07 06 00 00 07"];

export const checkNormalVoggexMessageByContent  = (msg) => {
    switch (msg) {
        case "30 07 06 00 00 00":
            return false;
        case "20 03 06 07 80 04":
            return true;
        case "20 02 06 07 70 20":
            return true;
        case "30 02 06 00 00 00":
            return false;
        case "20 06 04 00":
            return true;
        case "30 01 06 00 08":
            return true;
        case "20 01 04 00":
            return true;
        case "30 03 06 00 10 05":
            return true;
        case "10 01 04 00":
            return true;
        case "30 05 06 00 00 00":
            return true;
        case "30 01 06 00 00 08":
            return true;
        case "20 01 04 08":
            return true;
        default:
            return true;
    }
}
