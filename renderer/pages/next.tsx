import React, {useRef} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactECharts from 'echarts-for-react';
import {
  Layout,
  Result,
} from 'antd';
import electron from "electron";

const {
  Header,
  Content,
} = Layout;

const ipcRenderer = electron.ipcRenderer;

const colors: string[] = ['#5470C6', '#EE6666'];
const option = {
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

function Next() {

    const echartRef =  useRef(null);

    React.useEffect(() => {

        ipcRenderer.on('spectral-view-show', (event, data) => {
            let channelId = JSON.parse(data).channelId;
            if(channelId == 0){
                option.xAxis[0].data = JSON.parse(data).content[0];
                let ydata = JSON.parse(data).content[1].map(x => x == 0 ? 0.5: x).map(x => 10 * Math.log10(x/2500000));
                // @ts-ignore
                option.yAxis[0].min = Math.min(...ydata).toFixed(5) ;
                // @ts-ignore
                option.yAxis[0].max = Math.max(...ydata).toFixed(5) ;
                option.series[0].data = ydata;
                option.series[0].name = "通道0光谱图";
                echartRef.current.getEchartsInstance().setOption(option);
            }
        });

        return () => {
            ipcRenderer.removeAllListeners('spectral-view-show');
        };
    }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Wave</title>
      </Head>

      <Header>
        <Link href="/home">
          <a>Main</a>
        </Link>
      </Header>

      <Content style={{ padding: 48}} >
          <ReactECharts ref={echartRef} option={option}  style={{ height: 800 }}/>
      </Content>
    </React.Fragment>
  );
};

export default Next;
