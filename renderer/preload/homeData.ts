import {axisdata, seriesdata} from "./testData";

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
            max: -60,
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

export var echart1Option = Object.assign({}, echartOption);
export var echart2Option = Object.assign({}, echartOption);
export var echart3Option = Object.assign({}, echartOption);

export var echartOptionArray = [echartOption, echart1Option, echart2Option, echart3Option];
