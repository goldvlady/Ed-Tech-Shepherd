import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function PerformanceChart(chartData) {
  const [labels, setLabels] = useState();
  const [values, setValues] = useState();

  const arrData: Array<any> = [...chartData.chartData];

  useEffect(() => {
    const flashcardNames: any = arrData.map((item) =>
      item.flashcardName.substring(0, 3)
    );
    const flashcardPercentages: any = arrData.map(
      (item) => item.scorePercentage
    );
    setLabels(flashcardNames);
    setValues(flashcardPercentages);
  }, [chartData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false
      },
      title: {
        display: false,
        text: 'Quiz Performance'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: true
        }
      }
    }
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: values,
        backgroundColor: '#207df7',
        barThickness: 18,
        borderRadius: 50
      }
    ]
  };

  return <Bar options={options} data={data} style={{ width: '100%' }} />;
}
