import React, {useRef} from 'react';
import Head from 'next/head';
import dgram from 'dgram'

import {Button, Layout, Row,  Space} from 'antd';
import ReactECharts from "echarts-for-react";

import {echartOption} from "../preload/homeData";
import {ArraytoStringArray, string2ArrayBuffer, Uint8ArraytoNumberArray,} from "../utils/strUtil";
import {generateAxis} from "../utils/algorithm";
import {localIP, localPort, remoteIP, remotePort} from "../utils/const";

const {
  Header,
  Content,
} = Layout;

function Home() {

    const echartRef =  useRef(null);

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
        if (showWaveIntervId && rawBufferU8A.length == 4101) {
            echartOption.xAxis[0].data = ArraytoStringArray(generateAxis());
            echartOption.series[0].data = Uint8ArraytoNumberArray(rawBufferU8A);
            echartRef.current.getEchartsInstance().setOption(echartOption);
            rawTotalBuffer = Buffer.alloc(0);
        }
    });

    const stopShowWave = () => {
        clearInterval(showWaveIntervId);
        showWaveIntervId = 0;
        echartOption.xAxis[0].data = [];
        echartOption.series[0].data = [];
        echartRef.current.getEchartsInstance().setOption(echartOption);
    }

    const getSpectralViewFunc = () => {
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

    return (
        <React.Fragment>
            <Head>
                <title>Voggex dynamic</title>
            </Head>

            <Content style={{padding: 48}}>
                <Row>
                    <Space size={16}>
                        <Button onClick={() => getSpectralViewFunc()} size='large' type='primary'>Spectral View</Button>
                        <Button onClick={() => stopShowWave()} size='large' type='primary'>Stop</Button>
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
