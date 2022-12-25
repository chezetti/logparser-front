import { useState, useEffect } from "react";
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import styles from "../../../styles/Home.module.css";
import 'chart.js/auto';
import { IParsedLog } from "./interfaces/parsed-log.interface";

interface IOccuranceFrequency {
    [level: string]: {
        [date: string]: number;
    };
}

export default function PrivatePage() {
    const [file, setFile] = useState(null);
    const [errorCount, setErrorCount] = useState(0);
    const [infoCount, setInfoCount] = useState(0);
    const [warnCount, setWarnCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [shouldHide, setShouldHide] = useState(true);

    const [levelCountsByTimestamp, setlevelCountsByTimestamp] = useState<IOccuranceFrequency>({});
    const [levelCountsByTimestampData, setlevelCountsByTimestampData] = useState({});

    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            console.log(file.name);
            setFile(file);
        }
    };

    const uploadToServer = async (event: any) => {
        const formData = new FormData();
        formData.append("file", file!);

        const requestOptions = {
            method: 'POST',
            body: formData,
        };

        fetch("http://localhost:9000/parser", requestOptions)
            .then(response => response.json())
            .then((data: IParsedLog) => {
                setErrorCount(data.logLevelInfo.ERROR);
                setInfoCount(data.logLevelInfo.INFO);
                setWarnCount(data.logLevelInfo.WARN);
                setTotalCount(data.logLevelInfo.TOTAL);
                setShouldHide(false);
                setlevelCountsByTimestamp(data.occuranceFrequency.levelCountsByTimestamp);

                // const timestamps = [
                //     new Set([
                //         ...Object.keys(levelCountsByTimestamp.INFO),
                //         ...Object.keys(levelCountsByTimestamp.ERROR),
                //         ...Object.keys(levelCountsByTimestamp.WARN),
                //     ]),
                // ];


                // const levelCountsByTimestampData = {
                //     labels: timestamps,
                //     datasets: [
                //         {
                //             label: 'INFO',
                //             data: [...Object.values(levelCountsByTimestamp.INFO)],
                //             borderColor: 'rgba(255, 99, 132, 1)',
                //             pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                //             pointBorderColor: '#fff',
                //             pointHoverBackgroundColor: '#fff',
                //             pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                //         },
                //         {
                //             label: 'ERROR',
                //             data: [...Object.values(levelCountsByTimestamp.ERROR)],
                //             borderColor: 'rgba(54, 162, 235, 1)',
                //             pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                //             pointBorderColor: '#fff',
                //             pointHoverBackgroundColor: '#fff',
                //             pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                //         },
                //         {
                //             label: 'WARNING',
                //             data: [...Object.values(levelCountsByTimestamp.INFO)],
                //             borderColor: 'rgba(255, 206, 86, 1)',
                //             pointBackgroundColor: 'rgba(255, 206, 86, 1)',
                //             pointBorderColor: '#fff',
                //             pointHoverBackgroundColor: '#fff',
                //             pointHoverBorderColor: 'rgba(255, 206, 86, 1)',
                //         },
                //     ],
                // };
                // setlevelCountsByTimestampData(levelCountsByTimestampData);
            })
            .catch(error => console.log('error', error));
    };

    const levelCountData = {
        labels: ['Errors', 'Infos', 'Warns'],
        datasets: [
            {
                label: 'Level Count',
                data: [errorCount, infoCount, warnCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }
        ]
    };

    const donutData = {
        labels: [
            'ERROR',
            'INFO',
            'WARN'
        ],
        datasets: [{
            data: [errorCount, infoCount, warnCount],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ]
        }]
    };

    const pieData = {
        labels: [
            'ERROR',
            'INFO',
            'WARN'
        ],
        datasets: [{
            data: [errorCount, infoCount, warnCount],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ]
        }]
    };


    return (
        <div>
            <div className="">
                <div className="container-fluid ms-4 mt-4">
                    <h1 className="justify-content-center d-flex">Ontleder</h1>
                    <h2>Select File</h2>
                    <div className="row">
                        <div className="col-lg-4 col-11">
                            <input className="form-control" type="file" id="formFile" onChange={uploadToClient} />
                        </div>
                        <div className="col-lg-2 mt-3 mt-lg-0">
                            <button
                                type="button"
                                className="btn btn-success ms-lg-3 col-5"
                                onClick={uploadToServer}
                            >
                                Parse
                            </button>
                        </div>
                    </div>

                    <div className={shouldHide ? 'd-none' : 'row row-cols-1 mt-3'}>
                        <div className="col">
                            <p className="fs-3">Errors: {errorCount}</p>
                        </div>
                        <div className="col">
                            <p className="fs-3">Infos: {infoCount}</p>
                        </div>
                        <div className="col">
                            <p className="fs-3">Warns: {warnCount}</p>
                        </div>
                        <div className="col">
                            <p className="fs-3">Total: {totalCount}</p>
                        </div>
                    </div>
                </div>
                <div className={shouldHide ? 'd-none' : 'container'}>
                    <div className="row justify-content-between">
                        <div className="col-lg-5 col-12 text-center mb-5">
                            <h2>Log Level Count Bar</h2>
                            <Bar
                                data={levelCountData}
                                width={100}
                                height={100}
                            />
                        </div>

                        {/* <Bar
                            data={levelCountsByTimestampData} 
                            // options={levelCountsByTimestampOptions}
                      /> */}
                        <div className="col-lg-5 col-12 text-center mb-5">
                            <h2>Level Counts By Timestamp Bar</h2>
                            <Doughnut
                                data={donutData}
                                width={100}
                                height={100}
                            />
                        </div>
                        <div className="col-lg-5 col-12 text-center mb-5">
                            <Pie
                                data={pieData}
                                width={100}
                                height={100}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
