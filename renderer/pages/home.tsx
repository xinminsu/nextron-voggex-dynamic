import electron from 'electron';
import React, {useRef, useState} from 'react';
import Head from 'next/head';
import {Button, Input, Layout, Row,  Space} from 'antd';
import ReactECharts from "echarts-for-react";

import {echartOption} from "../preload/homeData";

const { TextArea } = Input;

const ipcRenderer = electron.ipcRenderer || false;

const {
  Header,
  Content,
} = Layout;

function Home() {

    const echartRef =  useRef(null);
    let [outputMsg, setOutputMsg] = useState("");

    React.useEffect(() => {

        ipcRenderer && ipcRenderer.on('spectral-view-show', (event, data) => {
            echartOption.xAxis[0].data = JSON.parse(data).content[0];
            echartOption.series[0].data = JSON.parse(data).content[1];
            echartRef.current.getEchartsInstance().setOption(echartOption);
        });

        ipcRenderer && ipcRenderer.on('wave-length-show', (event, data) => {
            setOutputMsg(data);
        });

        return () => {
            ipcRenderer &&  ipcRenderer.removeAllListeners('spectral-view-show');
            ipcRenderer &&  ipcRenderer.removeAllListeners('wave-length-show');
        };
    }, []);

    const clearOutput = () => {
        setOutputMsg('');
    }

    const stopShowWave = () => {
        ipcRenderer && ipcRenderer.send('spectral-view-stop', '');

        echartOption.xAxis[0].data = [];
        echartOption.series[0].data = [];
        echartRef.current.getEchartsInstance().setOption(echartOption);
    }

    const spectralView = () => {
        ipcRenderer && ipcRenderer.send('spectral-view-start', '');
    }

    const waveLength = () => {
        ipcRenderer && ipcRenderer.send('get-wave-length', '');
    }

    return (
        <React.Fragment>
            <Head>
                <title>Voggex dynamic</title>
            </Head>

            <Content style={{padding: 48}}>
                <Row>
                    <Space size={16}>
                        <Button onClick={() => spectralView()} size='large' type='primary'>Spectral View</Button>
                        <Button onClick={() => stopShowWave()} size='large' type='primary'>Stop</Button>
                        <Button onClick={() => waveLength()} size='large' type='primary'>Wave length</Button>
                    </Space>
                </Row>
                <br/>
                <br/>
                <Row>
                    <Space size={16}>
                        <TextArea rows={2} value={outputMsg} style={{ width: '500px' }}/>
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
