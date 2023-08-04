import electron from 'electron';
import React, {useRef, useState} from 'react';
import Head from 'next/head';
import {Button, Input, Layout, Row, Space} from 'antd';
import ReactECharts from "echarts-for-react";

import {echart1Option, echart2Option, echart3Option, echartOption,
    echart4Option, echart5Option, echart6Option, echart7Option, echartOptionArray, waves} from "../preload/homeData";
import WaveComponent from "../components/Wave";
import {UdpUIType} from "../data/persistence";
import {useRouter} from "next/router";

const { TextArea } = Input;

const ipcRenderer = electron.ipcRenderer;

const {
  Header,
  Content,
} = Layout;

function Home() {

    //const { query } = useRouter();

    const echartRef0 =  useRef(null);
    const echartRef1 =  useRef(null);
    const echartRef2 =  useRef(null);
    const echartRef3 =  useRef(null);
    const echartRef4 =  useRef(null);
    const echartRef5 =  useRef(null);
    const echartRef6 =  useRef(null);
    const echartRef7 =  useRef(null);
    const echartRefArray = [echartRef0, echartRef1, echartRef2, echartRef3,
        echartRef4, echartRef5, echartRef6, echartRef7];

    const [outputMsg, setOutputMsg] = useState("");
    const [spvwDisabled, setSpvwDisabled] = useState(false);
    const [lengthDisabled, setLengthDisabled] = useState(false);
    const [stopDisabled, setStopDisabled] = useState(true);
    //const [udpUIType, setUdpUIType] = useState(UdpUIType.None);

    React.useEffect(() => {

        ipcRenderer.on('spectral-view-show', (event, data) => {
            let channelId = JSON.parse(data).channelId;
            showChannelWave(channelId, data);
        });

        ipcRenderer.on('wave-length-show', (event, data) => {
            setOutputMsg(data);
        });

        //setUdpUIType(ipcRenderer.sendSync('get-udpUIType'));

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

        for(let i=0 ; i < 8; i++ ){
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

    /*    const resetButton = () => {
            setStopDisabled(true);
            setSpvwDisabled(false);
            setLengthDisabled(fal);
        }*/

    /*if (query.name == 'home') {
        console.log("back to home");
        }
    }*/

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

                <WaveComponent key={waves[0].id} wave={waves[0]} />
                <ReactECharts  ref={echartRef0}
                               option={echartOption}/>
                <WaveComponent key={waves[1].id} wave={waves[1]} />
                <ReactECharts  ref={echartRef1}
                               option={echart1Option}/>
                <WaveComponent key={waves[2].id} wave={waves[2]} />
                <ReactECharts  ref={echartRef2}
                               option={echart2Option}/>
                <WaveComponent key={waves[3].id} wave={waves[3]} />
                <ReactECharts  ref={echartRef3}
                               option={echart3Option}/>
                <WaveComponent key={waves[4].id} wave={waves[4]} />
                <ReactECharts  ref={echartRef4}
                               option={echart4Option}/>
                <WaveComponent key={waves[5].id} wave={waves[5]} />
                <ReactECharts  ref={echartRef5}
                               option={echart5Option}/>
                <WaveComponent key={waves[6].id} wave={waves[6]} />
                <ReactECharts  ref={echartRef6}
                               option={echart6Option}/>
                <WaveComponent key={waves[7].id} wave={waves[7]} />
                <ReactECharts  ref={echartRef7}
                               option={echart7Option}/>
            </Content>


        </React.Fragment>
    );
};

export default Home;
