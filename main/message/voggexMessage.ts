import {string2ArrayBuffer} from "../utils/strUtil";

export const spvwStringMsg = "30 07 06 00 00 00";
export const spvwMsg = string2ArrayBuffer(spvwStringMsg.replaceAll(" ", ""));

export const waveLengthStringMsg = "30 02 06 00 00 00";
export const waveLengthMsg = string2ArrayBuffer(waveLengthStringMsg.replaceAll(" ", ""));

export const spvwStringMsgArray = ["30 07 06 00 00 00","30 07 06 00 00 01",
    "30 07 06 00 00 02","30 07 06 00 00 03"];
