import electron from 'electron';
import React, {useRef, useState} from 'react';
import Head from 'next/head';
import {Button, Input, Layout, Row,  Space} from 'antd';
import ReactECharts from "echarts-for-react";

import {echartOption} from "../preload/homeData";

const { TextArea } = Input;

const ipcRenderer = electron.ipcRenderer;

const {
  Header,
  Content,
} = Layout;

function Home() {

    const echartRef =  useRef(null);
    let [outputMsg, setOutputMsg] = useState("");
    let [spvwDisabled, setSpvwDisabled] = useState(false);
    let [lengthDisabled, setLengthDisabled] = useState(false);
    let [stopDisabled, setStopDisabled] = useState(true);

    React.useEffect(() => {

        ipcRenderer.on('spectral-view-show', (event, data) => {
            echartOption.xAxis[0].data = JSON.parse(data).content[0];
            let ydata = JSON.parse(data).content[1].map(x => x == 0 ? 0.5: x).map(x => 10 * Math.log10(x/2500000));
            // @ts-ignore
            echartOption.yAxis[0].min = Math.min(...ydata).toFixed(5) ;
            // @ts-ignore
            echartOption.yAxis[0].max = Math.max(...ydata).toFixed(5) ;
            echartOption.series[0].data = ydata;
            echartRef.current.getEchartsInstance().setOption(echartOption);
        });

        ipcRenderer.on('wave-length-show', (event, data) => {
            setOutputMsg(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('spectral-view-show');
            ipcRenderer.removeAllListeners('wave-length-show');
        };
    }, []);

    const clearOutput = () => {
        setOutputMsg('');
    }

    const stopVoggex = () => {
        setStopDisabled(true);
        setSpvwDisabled(false);
        setLengthDisabled(false);

        ipcRenderer.send('voggex-stop', '');

        echartOption.xAxis[0].data = [];
        echartOption.series[0].data = [];
        echartRef.current.getEchartsInstance().setOption(echartOption);
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
            </Content>

            <br/>
            <ReactECharts  ref={echartRef}
                option={echartOption}
                          style={{ height: '500px' }}/>
        </React.Fragment>
    );
};

export default Home;
