import electron from 'electron';
import React, {useRef, useState} from 'react';
import Head from 'next/head';

import {Button, Col, Input, Layout, Row, Select, Space} from 'antd';
import {getVoggexMessageContent, MsgType} from "../msg/voggexMessage";
import {echartOption, echartOptionArray, selectOption} from "../preload/homeData";
import Link from "next/link";

const { TextArea } = Input;

const ipcRenderer = electron.ipcRenderer;

const {
    Header,
    Content,
} = Layout;

function UdpConfig() {

    ipcRenderer.send('udp-config');

    let [sendMsg, setSendMsg] = useState("");
    let [recvMsg, setRecvMsg] = useState("");
    let [outputMsg, setOutputMsg] = useState("");
    let [curMsg, setCurMsg ] = useState(MsgType.None);

    React.useEffect(() => {

        ipcRenderer.on('normal-result', (event, data) => {
            setRecvMsg(data);
        });

        return () => {
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

    const handleChange = (value: MsgType) => {
        setCurMsg(value);
        setSendMsg(getVoggexMessageContent(value));
    };

    const backHome = () => {
        for(let i=0 ; i < 8; i++ ){
            echartOptionArray[i].xAxis[0].data = [];
            echartOptionArray[i].series[0].data = [];
            echartOptionArray[i].series[0].name = "通道光谱图"
        }
    }

    return (
        <React.Fragment>
            <Head>
                <title>Udp Config</title>
            </Head>

            <Header>
                <Link href={{ pathname: '/home', query: { name: 'home' } }}>
                    <a onClick={backHome}>Main</a>
                </Link>
            </Header>

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

            </Content>

        </React.Fragment>
    );
};

export default UdpConfig;
