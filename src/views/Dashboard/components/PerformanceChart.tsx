import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },
    title: {
      display: false,
      text: "Quiz Performance",
    },
  },
};

const labels = ["Bio", "Phy", "Che", "Eco", "Eng", "Bus", "Sci", "Lit"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [10, 40, 20, 70, 85, 15, 25, 5],
      backgroundColor: "#207df7",
      barThickness: 12,
    },
    // {
    //   label: "Dataset 2",
    //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
    //   backgroundColor: "rgba(53, 162, 235, 0.5)",
    // },
  ],
};

export function PerformanceChart() {
  return <Bar options={options} data={data} style={{ width: "100%" }} />;
}
