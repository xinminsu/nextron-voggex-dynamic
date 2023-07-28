import {MsgType} from "../../renderer/msg/voggexMessage";

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
