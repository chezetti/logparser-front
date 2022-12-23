import { useState } from "react";
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

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
      .then((data) => {
        setErrorCount(data.levelInfo.errorCount);
        setInfoCount(data.levelInfo.infoCount);
        setWarnCount(data.levelInfo.warnCount);

        setlevelCountsByTimestamp(data.occuranceFrequency.levelCountsByTimestamp);
        console.log(levelCountsByTimestamp)

        const timestamps = [
          new Set([
            ...Object.keys(levelCountsByTimestamp.INFO),
            ...Object.keys(levelCountsByTimestamp.ERROR),
            ...Object.keys(levelCountsByTimestamp.WARN),
          ]),
        ];
        
      
        const levelCountsByTimestampData = {
          labels: timestamps,
          datasets: [
            {
              label: 'INFO',
              data: [...Object.values(levelCountsByTimestamp.INFO)],  
              borderColor: 'rgba(255, 99, 132, 1)',
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
            },
            {
              label: 'ERROR',
              data: [ ...Object.values(levelCountsByTimestamp.ERROR) ],
              borderColor: 'rgba(54, 162, 235, 1)',
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
            },
            {
              label: 'WARNING',
              data: [...Object.values(levelCountsByTimestamp.INFO)],
              borderColor: 'rgba(255, 206, 86, 1)',
              pointBackgroundColor: 'rgba(255, 206, 86, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(255, 206, 86, 1)',
            },
          ],
        }; 
        setlevelCountsByTimestampData(levelCountsByTimestampData);
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
      <div>
        <h4>Select File</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Parse
        </button>
        <p></p>
        <div>Errors: {errorCount}, Infos: {infoCount}, Warns: {warnCount}</div>
        <h2>Log Level Count Bar</h2>
        <Bar
          data={levelCountData}
        />
        <h2>Level Counts By Timestamp Bar</h2>
        {/* <Bar
          data={levelCountsByTimestampData} 
          // options={levelCountsByTimestampOptions}
        /> */}
        <Doughnut
			    data={donutData}
		    />
        <Pie
          data={pieData}
        />
      </div>
    </div>
  );
}
