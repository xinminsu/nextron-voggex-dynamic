import {axisdata, seriesdata} from "./testData";
import clone from 'lodash.clone';
import {MsgType} from "../msg/voggexMessage";

export const selectOption = [
    { value: MsgType.None, label: 'None' },
    //{ value: MsgType.SpectralView, label: 'SpectralView' },
    { value: MsgType.GainSettings, label: 'GainSettings' },
    { value: MsgType.ThresholdSettings, label: 'ThresholdSettings' },
    //{ value: MsgType.WaveLength, label: 'WaveLength'},
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
            type: 'value',
            axisLabel: {
                formatter: '{value} db'
            },
            min: -60,
            max: -30,
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

export var echart1Option = clone(echartOption);
export var echart2Option = clone(echartOption);
export var echart3Option = clone(echartOption);
export var echart4Option = clone(echartOption);
export var echart5Option = clone(echartOption);
export var echart6Option = clone(echartOption);
export var echart7Option = clone(echartOption);
export var oneEchartOption = clone(echartOption);
//oneEchartOption.xAxis[0].data = axisdata;
//oneEchartOption.series[0].data = seriesdata.map(x => x == 0 ? 0.5: x).map(x => 10 * Math.log10(x/2500000));
//export default oneEchartOption;

export var echartOptionArray = [echartOption, echart1Option, echart2Option, echart3Option,
    echart4Option, echart5Option, echart6Option, echart7Option];

export const waves = [
    {
        id: 1,
        name: 'channel1'
    },
    {
        id: 2,
        name: 'channel2'
    },
    {
        id: 3,
        name: 'channel3'
    },
    {
        id: 4,
        name: 'channel4'
    },
    {
        id: 5,
        name: 'channel5'
    },
    {
        id: 6,
        name: 'channel6'
    },
    {
        id: 7,
        name: 'channel7'
    },
    {
        id: 8,
        name: 'channel8'
    }]
