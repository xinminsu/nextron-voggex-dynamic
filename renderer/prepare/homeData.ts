import {MsgType} from "../msg/voggexMessage";

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
export const echartOption = {
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
            data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Precipitation(2016)',
            type: 'line',
            smooth: true,
            emphasis: {
                focus: 'series'
            },
            data: [
                3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7
            ]
        }
    ]
};
