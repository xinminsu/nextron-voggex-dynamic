import {MsgType} from "../msg/voggexMessage";
import {axisdata, seriesdata} from "./testData";

export const selectOption = [
    { value: MsgType.None, label: 'None' },
    { value: MsgType.SpectralView, label: 'SpectralView' },
    { value: MsgType.GainSettings, label: 'GainSettings' },
    { value: MsgType.ThresholdSettings, label: 'ThresholdSettings' },
    { value: MsgType.WaveLength, label: 'WaveLength'},
    { value: MsgType.ParameterSave, label: 'ParameterSave' },
    { value: MsgType.VirtuaDataValidation, label: 'VirtuaDataValidation' },
    { value: MsgType.ParameterReads, label: 'ParameterReads' },
    { value: MsgType.IndividualWavelengthVerification, label: 'IndividualWavelengthVerification'},
    { value: MsgType.Version, label: 'Version' },
    { value: MsgType.AutomaticDebugging, label: 'AutomaticDebugging' },
    { value: MsgType.VirtualChannelReads, label: 'VirtualChannelReads' },
    { value: MsgType.ParameterReadsExpand, label: 'ParameterReadsExpand'},
    { value: MsgType.IndividualWaveLength, label: 'IndividualWaveLength' },
    { value: MsgType.AutomatictuningGain, label: 'AutomatictuningGain' },
];

const colors: string[] = ['#5470C6', '#EE6666'];
export var echartOption = {
    color: colors,
    tooltip: {
        trigger: 'none',
        axisPointer: {
            type: 'cross'
        }
    },
    legend: {},
    grid: {
        top: 70,
        bottom: 50
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: colors[1]
                }
            },
            axisPointer: {
                label: {
                    formatter: (params: any) => {
                        return (
                            'Precipitation  ' +
                            params.value +
                            (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                        );
                    }
                }
            },
            // prettier-ignore
            data: []
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '光谱图',
            type: 'line',
            smooth: true,
            emphasis: {
                focus: 'series'
            },
            data: []
        }
    ]
};
