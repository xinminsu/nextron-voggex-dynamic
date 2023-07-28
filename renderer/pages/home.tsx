import electron from 'electron';
import React, {useRef, useState} from 'react';
import Head from 'next/head';

import {Button, Col, Input, Layout, Row, Select, Space} from 'antd';
import ReactECharts from "echarts-for-react";
import {getVoggexMessageContent, MsgType} from "../msg/voggexMessage";
import {echartOption, selectOption} from "../preload/homeData";
import {getWaveLengthInfo} from "../utils/algorithm";

const { TextArea } = Input;

const ipcRenderer = electron.ipcRenderer;

const {
  Header,
  Content,
} = Layout;

function Home() {

    const echartRef =  useRef(null);

    let [sendMsg, setSendMsg] = useState("");
    let [recvMsg, setRecvMsg] = useState("");
    let [outputMsg, setOutputMsg] = useState("");
    let [curMsg, setCurMsg ] = useState(MsgType.None);

    React.useEffect(() => {

        ipcRenderer.on('spectral-view-show', (event, data) => {
            echartOption.xAxis[0].data = JSON.parse(data).content[0];
            echartOption.series[0].data = JSON.parse(data).content[1];
            echartRef.current.getEchartsInstance().setOption(echartOption);
        });

        ipcRenderer.on('wave-length-show', (event, data) => {
            setOutputMsg(data);
        });

        ipcRenderer.on('normal-result', (event, data) => {
            setRecvMsg(data);
        });

        return () => {
            ipcRenderer.removeAllListeners('spectral-view-show');
            ipcRenderer.removeAllListeners('normal-result');
        };
    }, []);

    const clearServer = () => {
        setRecvMsg('');
    }

    const clearOutput = () => {
        setOutputMsg('');
    }
    const sendFunc = () => {
        if (sendMsg) {
            ipcRenderer.send('udp-send', sendMsg);
        }
    }

    const spectralView = () => {
        ipcRenderer.send('spectral-view-start', '');
    }

    const handleChange = (value: MsgType) => {
        setCurMsg(value);
        setSendMsg(getVoggexMessageContent(value));
    };

    return (
        <React.Fragment>
            <Head>
                <title>Voggex</title>
            </Head>
            
            <Content style={{padding: 48}}>
                <Row>
                    <Col span={12}>
                        <label>Client:</label>
                        <br/>
                        <Space wrap>
                            <Select
                                defaultValue ={MsgType.None}
                                style={{ width: 200 }}
                                onChange={handleChange}
                                options={selectOption}
                            />
                        </Space>
                        <TextArea rows={4} value={sendMsg}
                                  onChange={e => setSendMsg(e.target.value)}/>
                        <br/>

                        <Button onClick={() => sendFunc()} size='large' type='primary'>
                            Send
                        </Button>

                    </Col>
                    <Col span={12}>
                        <label>Server:</label>
                        <br/>
                        <TextArea rows={8} value={recvMsg} onChange={e => setRecvMsg(e.target.value)}/>
                        <br/>
                        <Button onClick={() => clearServer()} size='large' type='primary'>
                            Clear
                        </Button>

                    </Col>
                </Row>

                <br/>
                <Row>
                    <Space size={16}>
                        <TextArea rows={2} value={outputMsg} style={{ width: '500px' }}/>
                        <Button onClick={() => clearOutput()} size='large' type='primary'>
                            Clear
                        </Button>
                    </Space>
                </Row>

                <br/>
                <br/>

                <Row>
                    <Space size={16}>
                        <Button onClick={() => spectralView()} size='large' type='primary'>Spectral View</Button>
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
