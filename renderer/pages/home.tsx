import React, {useState} from 'react';
import Head from 'next/head';
import dgram from 'dgram'

import {Button, Col, Input, Layout, Row, Select, Space} from 'antd';
import ReactECharts from "echarts-for-react";
import {getVoggexMessageContent, MsgType} from "../msg/voggexMessage";
import {echartOption, selectOption} from "../preload/homeData";
import {string2ArrayBuffer, toHexString} from "../utils/strUtil";
import {getWaveLengthInfo} from "../utils/algorithm";

const { TextArea } = Input;

const {
  Header,
  Content,
} = Layout;


function Home() {

    const [sendMsg, setSendMsg] = useState("");
    const [recvMsg, setRecvMsg] = useState("");
    const [outputMsg, setOutputMsg] = useState("");
    const [curMsg, setCurMsg ] = useState(MsgType.None);

    const socket = dgram.createSocket('udp4');

    socket.bind(4567, "192.168.0.123", () => {
    });

    let rawTotalBuffer: Buffer = new Buffer('');

    socket.on('message', (msg, rinfo) => {
        //console.log("recv msg length is " + msg.length);
        rawTotalBuffer = Buffer.concat([rawTotalBuffer, msg]);
        let rawBufferU8A:Uint8Array = new Uint8Array(rawTotalBuffer);
        let rawTotalMsg = toHexString(rawBufferU8A);
        //console.log("recv raw hex msg length is " + rawTotalMsg.length);
        if (curMsg == MsgType.WaveLength && rawTotalMsg.length == 3624) {
            setOutputMsg(getWaveLengthInfo(rawBufferU8A));
        }
        setRecvMsg(rawTotalMsg);
    });

    const sendFunc: () => void = () => {
        if (sendMsg) {
            let smsg = string2ArrayBuffer(sendMsg.replaceAll(" ", ""));
            socket.send(smsg, 8080, '192.168.0.80');
        }
    }

    const clearFunc: () => void = () => {
        setRecvMsg('');
    }

    const startFunc: () => void = () => {

    }

    const closeFunc: () => void = () => {

    }

    const getWaveLengthFunc: () => void = () => {
        let cmdMsg = "30 02 06 00 00 00";
        let smsg = string2ArrayBuffer(cmdMsg.replaceAll(" ", ""));
        setCurMsg(MsgType.WaveLength);
        socket.send(smsg, 8080, '192.168.0.80');
    }

    const getSpectralWiewFunc: () => void = () => {
        let cmdMsg = "30 07 06 00 00 07";
        let smsg = string2ArrayBuffer(cmdMsg.replaceAll(" ", ""));
        setCurMsg(MsgType.SpectralView);
        socket.send(smsg, 8080, '192.168.0.80');
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

{/*            <Header>
                <Link href="/next">
                    <a>Go to wave page</a>
                </Link>
            </Header>*/}

            <Content style={{padding: 48}}>
                <Row>
                    <Space size={16}>
                        <Button onClick={() => startFunc()} size='large' type='primary'>Start</Button>
                        <Button onClick={() => closeFunc()} size='large' type='primary'>Close</Button>
                        <Button onClick={() => getWaveLengthFunc()} size='large' type='primary'>Wave Leng</Button>
                        <Button onClick={() => getSpectralWiewFunc()} size='large' type='primary'>Spectral Wiew</Button>
                    </Space>
                </Row>

                <br/>
                <br/>
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
                        <Button onClick={() => clearFunc()} size='large' type='primary'>
                            Clear
                        </Button>

                    </Col>
                </Row>

                <br/>
                <br/>

                <TextArea rows={2} value={outputMsg}/>

                <br/>
                <br/>

                <ReactECharts option={echartOption} />

            </Content>
        </React.Fragment>
    );
};

export default Home;
