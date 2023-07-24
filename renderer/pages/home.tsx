import React, {useRef, useState} from 'react';
import Head from 'next/head';
import dgram from 'dgram'

import {Button, Col, Input, Layout, Row, Select, Space} from 'antd';
import ReactECharts from "echarts-for-react";
import {getVoggexMessageContent, MsgType} from "../msg/voggexMessage";
import {echartOption, selectOption} from "../preload/homeData";
import {
    ArraytoStringArray,
    string2ArrayBuffer,
    toHexString,
    Uint8ArraytoNumberArray,
} from "../utils/strUtil";
import {generateAxis, getWaveLengthInfo} from "../utils/algorithm";
import {localIP, localPort, remoteIP, remotePort} from "../utils/const";

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

    socket.bind(localPort, localIP, () => {
    });

    let rawTotalBuffer: Buffer = new Buffer('');

    socket.on('message', (msg, rinfo) => {

        rawTotalBuffer = Buffer.concat([rawTotalBuffer, msg]);
        let rawBufferU8A:Uint8Array = new Uint8Array(rawTotalBuffer);
        let rawTotalMsg = toHexString(rawBufferU8A);
        //console.log("recv raw hex msg length is " + rawTotalMsg.length);
        if (curMsg == MsgType.WaveLength && rawTotalMsg.length == 3624) {
            setOutputMsg(getWaveLengthInfo(rawBufferU8A));
        }
        if (curMsg == MsgType.SpectralView && rawTotalMsg.length == 12303) {
            echartOption.xAxis[0].data = ArraytoStringArray(generateAxis());
            // @ts-ignore
            echartOption.series[0].data = Uint8ArraytoNumberArray(rawBufferU8A);
            echartRef.current.getEchartsInstance().setOption(echartOption);
        }
        setRecvMsg(rawTotalMsg);
    });

    const echartRef =  useRef(null);;

    const sendFunc = () => {
        if (sendMsg) {
            let smsg = string2ArrayBuffer(sendMsg.replaceAll(" ", ""));
            socket.send(smsg, remotePort, remoteIP);
        }
    }

    const clearFunc = () => {
        setRecvMsg('');
        setOutputMsg('');
    }

    const startFunc= () => {

    }

    const closeFunc = () => {

    }

/*    const getWaveLengthFunc = () => {
        let cmdMsg = "30 02 06 00 00 00";
        let smsg = string2ArrayBuffer(cmdMsg.replaceAll(" ", ""));
        setCurMsg(MsgType.WaveLength);
        socket.send(smsg, remotePort, remoteIP);
    }

    const getSpectralViewFunc = () => {
        let cmdMsg = "30 07 06 00 00 00";
        let smsg = string2ArrayBuffer(cmdMsg.replaceAll(" ", ""));
        setCurMsg(MsgType.SpectralView);
        socket.send(smsg, remotePort, remoteIP);
    }*/

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
                        {/*<Button onClick={() => getWaveLengthFunc()} size='large' type='primary'>Wave Leng</Button>
                        <Button onClick={() => getSpectralViewFunc()} size='large' type='primary'>Spectral View</Button>*/}
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

            </Content>

            <ReactECharts  ref={echartRef}
                option={echartOption}
                          style={{ height: '500px' }}/>
        </React.Fragment>
    );
};

export default Home;
