import React, {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dgram from 'dgram'

import { Col, Row } from 'antd';

import {
  Layout,
  Button,
  Input,
  Space,
} from 'antd';
import ReactECharts from "echarts-for-react";

const { TextArea } = Input;

const {
  Header,
  Content,
} = Layout;

const string2ArrayBuffer = (str) => {
    return new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h,16)
    }))
};

const toHexString = (bytes: Uint8Array): string => {
    return bytes.reduce((str: string, byte: number) => str + byte.toString(16).padStart(2, '0') + ' ', '');
};

const createSocket = (): Promise<dgram.Socket> => {
    const socket = dgram.createSocket('udp4');
    
    return new Promise((resolve, reject) => {
        socket.bind(4567, "192.168.0.123", () => {
            resolve(socket);
        });
    })
}

const colors: string[] = ['#5470C6', '#EE6666'];
const option = {
    color: colors,
    tooltip: {
        trigger: 'none',
        axisPointer: {
            type: 'cross'
        }
    },
    legend: {},
    grid: {
        top: 70,
        bottom: 50
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: colors[1]
                }
            },
            axisPointer: {
                label: {
                    formatter: (params: any) => {
                        return (
                            'Precipitation  ' +
                            params.value +
                            (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                        );
                    }
                }
            },
            // prettier-ignore
            data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Precipitation(2016)',
            type: 'line',
            smooth: true,
            emphasis: {
                focus: 'series'
            },
            data: [
                3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7
            ]
        }
    ]
};

function Home() {

    const [sendMsg, setSendMsg] = useState("");
    const [recvMsg, setRecvMsg] = useState("");

    const socket = dgram.createSocket('udp4');

    socket.bind(4567, "192.168.0.123", () => {
    });

    let recvTotalMsg: string = '';

    socket.on('message', (msg, rinfo) => {
        let buffer:Uint8Array = new Uint8Array(msg);
        //console.log(`server got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
        recvTotalMsg += toHexString(buffer);
        setRecvMsg(recvTotalMsg);
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
        socket.send(smsg, 8080, '192.168.0.80');
    }

    const getSpectralWiewFunc: () => void = () => {
        let cmdMsg = "30 07 06 00 00 07";
        let smsg = string2ArrayBuffer(cmdMsg.replaceAll(" ", ""));
        socket.send(smsg, 8080, '192.168.0.80');
    }

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
                        <TextArea rows={8} value={recvMsg}/>
                        <br/>
                        <Button onClick={() => clearFunc()} size='large' type='primary'>
                            Clear
                        </Button>

                    </Col>
                </Row>

                <br/>
                <br/>

                <ReactECharts option={option} />

            </Content>
        </React.Fragment>
    );
};

export default Home;
