export enum MsgType {
    None,
    SpectralView,
    GainSettings,
    SimilaritySettings,
    SaveSettings,
    ThresholdSettings,
    WaveLength,
    ParameterSave,
    VirtuaDataValidation,
    ParameterReads,
    IndividualWavelengthVerification,
    Version,
    AutomaticDebugging,
    VirtualChannelReads,
    ParameterReadsExpand,
    IndividualWaveLength,
    AutomatictuningGain,

}

export interface VoggexMessage {
    type: MsgType;
    content: string;
}

export const EmptyVoggexMessage: VoggexMessage = {
    type: MsgType.None,
    content: ""
};

export const SpectralViewVoggexMessage: VoggexMessage = {
    type: MsgType.SpectralView,
    content: "30 07 06 00 00 00"
};

export const GainSettingsVoggexMessage: VoggexMessage = {
    type: MsgType.GainSettings,
    content: "20 03 06 07 80 04"
};

export const SimilaritySettingsVoggexMessage: VoggexMessage = {
    type: MsgType.SimilaritySettings,
    content: "20 02 06 01 70 01"
};

export const SaveSettingsVoggexMessage: VoggexMessage = {
    type: MsgType.SaveSettings,
    content: "20 06 04 00"
};

export const ThresholdSettingsVoggexMessage: VoggexMessage = {
    type: MsgType.ThresholdSettings,
    content: "20 02 06 07 70 20"
};

export const WaveLengthVoggexMessage: VoggexMessage = {
    type: MsgType.WaveLength,
    content: "30 02 06 00 00 00"
};

export const ParameterSaveVoggexMessage: VoggexMessage = {
    type: MsgType.ParameterSave,
    content: "20 06 04 00"
};

export const VirtuaDataValidationVoggexMessage: VoggexMessage = {
    type: MsgType.VirtuaDataValidation,
    content: "30 01 06 00 08"
};

export const ParameterReadsVoggexMessage: VoggexMessage = {
    type: MsgType.ParameterReads,
    content: "20 01 04 00"
};

export const IndividualWavelengthVerificationVoggexMessage: VoggexMessage = {
    type: MsgType.IndividualWavelengthVerification,
    content: "30 03 06 00 10 05"
};

export const VersionVoggexMessage: VoggexMessage = {
    type: MsgType.Version,
    content: "10 01 04 00"
};

export const AutomaticDebuggingVoggexMessage: VoggexMessage = {
    type: MsgType.AutomaticDebugging,
    content: "30 05 06 00 00 00"
};

export const VirtualChannelReadsVoggexMessage: VoggexMessage = {
    type: MsgType.VirtualChannelReads,
    content: "30 01 06 00 00 08"
};

export const ParameterReadsExpandVoggexMessage: VoggexMessage = {
    type: MsgType.ParameterReadsExpand,
    content: "20 01 04 08"
};

export const IndividualWaveLengthVoggexMessage: VoggexMessage = {
    type: MsgType.IndividualWaveLength
} as VoggexMessage;

export const AutomatictuningGainVoggexMessage: VoggexMessage = {
    type: MsgType.AutomatictuningGain
} as VoggexMessage;

export const getVoggexMessageContent = (type, channelId= 0, data = 0) => {
    switch (type) {
        case MsgType.SpectralView:
            return "30 07 06 00 00 00";
        case MsgType.GainSettings:
            return "20 03 06 " + channelId.toString(16).padStart(2, '0') + " 80 " +  data.toString(16).padStart(2, '0');
        case MsgType.SimilaritySettings:
            return "20 02 06 " + channelId.toString(16).padStart(2, '0') + " 70 " +  data.toString(16).padStart(2, '0');
        case MsgType.SaveSettings:
            return "20 06 04 00";
        case MsgType.ThresholdSettings:
            return "20 02 06 07 70 20";
        case MsgType.WaveLength:
            return "30 02 06 00 00 00";
        case MsgType.ParameterSave:
            return "20 01 04 00";
        case MsgType.VirtuaDataValidation:
            return "30 01 06 00 08";
        case MsgType.ParameterReads:
            return "20 01 04 00";
        case MsgType.IndividualWavelengthVerification:
            return "30 03 06 00 10 05";
        case MsgType.Version:
            return "10 01 04 00";
        case MsgType.AutomaticDebugging:
            return "30 05 06 00 00 00";
        case MsgType.VirtualChannelReads:
            return "30 01 06 00 00 08";
        case MsgType.ParameterReadsExpand:
            return "20 01 04 08";
        case MsgType.IndividualWaveLength:
            return "30 04 06 00";
        case MsgType.AutomatictuningGain:
            return "30 05 06";
        default:
            return "";
    }
}

export const checkNormalVoggexMessage  = (type) => {
    switch (type) {
        case MsgType.SpectralView:
            return false;
        case MsgType.GainSettings:
            return true;
        case MsgType.ThresholdSettings:
            return true;
        case MsgType.WaveLength:
            return false;
        case MsgType.ParameterSave:
            return true;
        case MsgType.VirtuaDataValidation:
            return true;
        case MsgType.ParameterReads:
            return true;
        case MsgType.IndividualWavelengthVerification:
            return true;
        case MsgType.Version:
            return true;
        case MsgType.AutomaticDebugging:
            return true;
        case MsgType.VirtualChannelReads:
            return true;
        case MsgType.ParameterReadsExpand:
            return true;
        case MsgType.IndividualWaveLength:
            return true;
        case MsgType.AutomatictuningGain:
            return true;
        default:
            return true;
    }
}


