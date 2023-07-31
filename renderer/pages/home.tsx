import electron from 'electron';
import React, {useRef, useState} from 'react';
import Head from 'next/head';
import {Button, Input, Layout, Row, Space} from 'antd';
import ReactECharts from "echarts-for-react";

import {echart1Option, echart2Option, echart3Option, echartOption, echartOptionArray} from "../preload/homeData";
import Link from "next/link";

const { TextArea } = Input;

const ipcRenderer = electron.ipcRenderer;

const {
  Header,
  Content,
} = Layout;

function Home() {

    const echartRef0 =  useRef(null);
    const echartRef1 =  useRef(null);
    const echartRef2 =  useRef(null);
    const echartRef3 =  useRef(null);
    const echartRefArray = [echartRef0, echartRef1, echartRef2, echartRef3];

    let [outputMsg, setOutputMsg] = useState("");
    let [spvwDisabled, setSpvwDisabled] = useState(false);
    let [lengthDisabled, setLengthDisabled] = useState(false);
    let [stopDisabled, setStopDisabled] = useState(true);

    React.useEffect(() => {

        ipcRenderer.on('spectral-view-show', (event, data) => {
            let channelId = JSON.parse(data).channelId;
            showChannelWave(channelId, data);
        });

        ipcRenderer.on('wave-length-show', (event, data) => {
            setOutputMsg(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('spectral-view-show');
            ipcRenderer.removeAllListeners('wave-length-show');
        };
    }, []);

    const showChannelWave = (channelId, data) =>{
        echartOptionArray[channelId].xAxis[0].data = JSON.parse(data).content[0];
        let ydata = JSON.parse(data).content[1].map(x => x == 0 ? 0.5: x).map(x => 10 * Math.log10(x/2500000));
        // @ts-ignore
        echartOptionArray[channelId].yAxis[0].min = Math.min(...ydata).toFixed(5) ;
        // @ts-ignore
        echartOptionArray[channelId].yAxis[0].max = Math.max(...ydata).toFixed(5) ;
        echartOptionArray[channelId].series[0].data = ydata;
        echartOptionArray[channelId].series[0].name = "通道"+ channelId + "光谱图";
        echartRefArray[channelId].current.getEchartsInstance().setOption(echartOptionArray[channelId]);
    }

    const clearOutput = () => {
        setOutputMsg('');
    }

    const stopVoggex = () => {
        setStopDisabled(true);
        setSpvwDisabled(false);
        setLengthDisabled(false);

        ipcRenderer.send('voggex-stop', '');

        for(let i=0 ; i < 4; i++ ){
            echartOptionArray[i].xAxis[0].data = [];
            echartOptionArray[i].series[0].data = [];
            echartRefArray[i].current.getEchartsInstance().setOption(echartOptionArray[i]);
        }
    }

    const spectralView = () => {
        setStopDisabled(false);
        setSpvwDisabled(true);
        setLengthDisabled(true);
        ipcRenderer.send('spectral-view-start', '');
    }

    const waveLength = () => {
        setStopDisabled(false);
        setSpvwDisabled(true);
        setLengthDisabled(true);
        ipcRenderer.send('get-wave-length', '');
    }

    return (
        <React.Fragment>
            <Head>
                <title>Voggex dynamic</title>
            </Head>

            <Content style={{padding: 48}}>
                <Row>
                    <Space size={16}>
                        <Button disabled={spvwDisabled} onClick={() => spectralView()} size='large' type='primary'>Spectral View</Button>
                        <Button disabled={stopDisabled} onClick={() => stopVoggex()} size='large' type='primary'>Stop</Button>
                        <Button disabled={lengthDisabled} onClick={() => waveLength()} size='large' type='primary'>Wave length</Button>
                    </Space>
                </Row>
                <br/>
                <br/>
                <Row>
                    <Space size={16}>
                        <TextArea rows={4} value={outputMsg} style={{ width: '800px' }}/>
                        <Button onClick={() => clearOutput()} size='large' type='primary'>
                            Clear
                        </Button>
                    </Space>
                </Row>
                <br/>

{/*                <Link href="/next">
                    <a>Detail</a>
                </Link>*/}
                <ReactECharts  ref={echartRef0}
                               option={echartOption}/>
                <ReactECharts  ref={echartRef1}
                               option={echart1Option}/>
                <ReactECharts  ref={echartRef2}
                               option={echart2Option}/>
                <ReactECharts  ref={echartRef3}
                               option={echart3Option}/>
            </Content>


        </React.Fragment>
    );
};

export default Home;
