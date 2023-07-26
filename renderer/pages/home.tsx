import React, {useRef, useState} from 'react';
import Head from 'next/head';
import dgram from 'dgram'

import {Button, Input, Layout, Row,  Space} from 'antd';
import ReactECharts from "echarts-for-react";

import {echartOption} from "../preload/homeData";
import {ArraytoStringArray, string2ArrayBuffer, Uint8ArraytoNumberArray,} from "../utils/strUtil";
import {generateAxis, getWaveLengthInfo} from "../utils/algorithm";
import {localIP, localPort, remoteIP, remotePort} from "../utils/const";

const { TextArea } = Input;

const {
  Header,
  Content,
} = Layout;

function Home() {

    const echartRef =  useRef(null);
    let [outputMsg, setOutputMsg] = useState("");

    let showWaveIntervId;

    const socket = dgram.createSocket('udp4');

    socket.bind(localPort, localIP, () => {
    });

    let rawTotalBuffer: Buffer = Buffer.alloc(0);
    let rawBufferU8A:Uint8Array;

    socket.on('message', (msg, rinfo) => {
        rawTotalBuffer = Buffer.concat([rawTotalBuffer, msg]);
        rawBufferU8A = new Uint8Array(rawTotalBuffer);
        //console.log("recv raw hex msg length is " + rawTotalMsg.length);
        if (rawBufferU8A.length == 1208) {
            setOutputMsg(getWaveLengthInfo(rawBufferU8A));
            rawTotalBuffer = Buffer.alloc(0);;
        }
        if (showWaveIntervId && rawBufferU8A.length == 4101) {
            echartOption.xAxis[0].data = ArraytoStringArray(generateAxis());
            echartOption.series[0].data = Uint8ArraytoNumberArray(rawBufferU8A);
            echartRef.current.getEchartsInstance().setOption(echartOption);
            rawTotalBuffer = Buffer.alloc(0);
        }
    });

    const clearOutput = () => {
        setOutputMsg('');
    }

    const stopShowWave = () => {
        clearInterval(showWaveIntervId);
        showWaveIntervId = 0;
        echartOption.xAxis[0].data = [];
        echartOption.series[0].data = [];
        echartRef.current.getEchartsInstance().setOption(echartOption);
    }

    const spectralView = () => {
        let cmdMsg = "30 07 06 00 00 00";
        let smsg = string2ArrayBuffer(cmdMsg.replaceAll(" ", ""));
        if(!showWaveIntervId){
            showWaveIntervId = setInterval(
                () => {
                    if(showWaveIntervId)
                        socket.send(smsg, remotePort, remoteIP);
                }, 4000);
        }
    }

    const waveLength = () => {
        let cmdMsg = "30 02 06 00 00 00";
        let smsg = string2ArrayBuffer(cmdMsg.replaceAll(" ", ""));
        socket.send(smsg, remotePort, remoteIP);
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
