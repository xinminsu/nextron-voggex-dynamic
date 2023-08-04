import React, {useRef} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import ReactECharts from 'echarts-for-react';
import {
    Layout,
    Result,
} from 'antd';
import electron from "electron";
import {echartOptionArray, oneEchartOption} from "../../preload/homeData";

const {
    Header,
    Content,
} = Layout;

const ipcRenderer = electron.ipcRenderer;

function WavePage() {

    const { query } = useRouter();
    // @ts-ignore
    let curChannelId = query.id - 1;
    ipcRenderer.send('one-spectral-view-start', curChannelId);

    const echartRef =  useRef(null);

    React.useEffect(() => {

        ipcRenderer.on('one-spectral-view-show', (event, data) => {
            oneEchartOption.xAxis[0].data = JSON.parse(data).content[0];
            let ydata = JSON.parse(data).content[1].map(x => x == 0 ? 0.5 : x).map(x => 10 * Math.log10(x / 2500000));
            // @ts-ignore
            oneEchartOption.yAxis[0].min = Math.min(...ydata).toFixed(5);
            // @ts-ignore
            oneEchartOption.yAxis[0].max = Math.max(...ydata).toFixed(5);
            oneEchartOption.series[0].data = ydata;
            oneEchartOption.series[0].name = "通道" + curChannelId + "光谱图";
            echartRef.current.getEchartsInstance().setOption(oneEchartOption);
        });

        return () => {
            ipcRenderer.removeAllListeners('one-spectral-view-show');
        };
    }, []);

    const backHome = () => {
        ipcRenderer.send('one-spectral-view-stop', curChannelId);
        for(let i=0 ; i < 8; i++ ){
            echartOptionArray[i].xAxis[0].data = [];
            echartOptionArray[i].series[0].data = [];
        }
    }

    return (
        <React.Fragment>
            <Head>
                <title>Wave</title>
            </Head>

            <Header>
                <Link href={{ pathname: '/home', query: { name: 'home' } }}>
                    <a onClick={backHome}>Main</a>
                </Link>
            </Header>

            <Content style={{ padding: 48}} >
                <ReactECharts ref={echartRef} option={oneEchartOption}  style={{ height: 800 }}/>
            </Content>
        </React.Fragment>
    );
};

export default WavePage;
