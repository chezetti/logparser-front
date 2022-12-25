import { useState } from "react";
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

import { IParsedLog } from "./interfaces/parsed-log.interface";
import { IOccuranceFrequency } from "./interfaces/occurance-frequency.interface";
import { APP } from "../../config/app.config";

export default function PrivatePage() {
    const [file, setFile] = useState(null);
    const [errorCount, setErrorCount] = useState(0);
    const [infoCount, setInfoCount] = useState(0);
    const [warnCount, setWarnCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [logLevelExpectationError, setlogLevelExpectationError] = useState(0);
    const [logLevelExpectationInfo, setlogLevelExpectationInfo] = useState(0);
    const [logLevelExpectationWarn, setlogLevelExpectationWarn] = useState(0);

    const [shouldHide, setShouldHide] = useState(true);

    const [levelCountsByTimestamp, setlevelCountsByTimestamp] = useState<IOccuranceFrequency>({});

    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

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

        fetch(`${APP.BACKEND_URL}/parser`, requestOptions)
            .then(response => response.json())
            .then((data: IParsedLog) => {
                setErrorCount(data.logLevelInfo.ERROR);
                setInfoCount(data.logLevelInfo.INFO);
                setWarnCount(data.logLevelInfo.WARN);
                setTotalCount(data.logLevelInfo.TOTAL);
                setShouldHide(false);
                setlevelCountsByTimestamp(data.occuranceFrequency.levelCountsByTimestamp);
                setlogLevelExpectationError(data.logLevelExpectation.ERROR);
                setlogLevelExpectationInfo(data.logLevelExpectation.INFO);
                setlogLevelExpectationWarn(data.logLevelExpectation.WARN);
            })
            .catch(error => console.log('error', error));
    };

    const timestamps = () => {
        if (Object.keys(levelCountsByTimestamp).length != 0) {
            console.log(Object.keys(levelCountsByTimestamp).length);
            return [
                new Set([
                    ...Object.keys(levelCountsByTimestamp.INFO),
                    ...Object.keys(levelCountsByTimestamp.ERROR),
                    ...Object.keys(levelCountsByTimestamp.WARN),
                ]),
            ];
        }

        return [];
    }; 


    const levelCountsByTimestampData = () => {
        if (Object.keys(levelCountsByTimestamp).length != 0) {
            return {
                labels: Array.from(timestamps()[0]).sort(),
                datasets: [
                    {
                        label: 'INFO',
                        data: [...Object.values(levelCountsByTimestamp.INFO)],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointBorderColor: 'blue',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                    },
                    {
                        label: 'ERROR',
                        data: [...Object.values(levelCountsByTimestamp.ERROR)],
                        borderColor: 'rgba(0, 0, 255, 1)', // blue
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointBorderColor: '#red',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                    },
                    {
                        label: 'WARN',
                        data: [...Object.values(levelCountsByTimestamp.WARN)],
                        borderColor: 'rgba(255, 206, 86, 1)',
                        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
                        pointBorderColor: 'yellow',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255, 206, 86, 1)',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                    },
                ],
            }
        }
        
        return {
            labels: [
                'ERROR',
                'INFO',
                'WARN'
            ],        
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
    };
  
    const logLevelExpectation = {
        labels: ['Errors', 'Infos', 'Warns'],
        datasets: [
            {
                label: 'Level Count',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [logLevelExpectationError, logLevelExpectationInfo, logLevelExpectationWarn]
            }
        ]
    };

    const logCountInfo = {
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
                '#FF5678',
                '#51B3FF',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#FF5678',
                '#51B3FF',
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
                        <h2>Log Math Expectation</h2>
                         <Line
                        //TODO
                        //@ts-ignore
                            data={logLevelExpectation}
                            width={100}
                            height={100}
                        />
                        </div>
                        <Line
                        //TODO
                        //@ts-ignore
                            data={levelCountsByTimestampData()} 
                        />
                        <div className="col-lg-5 col-12 text-center mb-5">
                            <h2>Log Info</h2>
                            <Bar
                                data={logCountInfo}
                                width={100}
                                height={100}
                            />
                        </div>
                        <div className="col-lg-5 col-12 text-center mb-5">
                            <h2>Log Info</h2>
                            <Doughnut
                                data={donutData}
                                width={100}
                                height={100}
                            />
                        </div>
                        <div className="col-lg-5 col-12 text-center mb-5">
                            <h2>Log Info</h2>
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
