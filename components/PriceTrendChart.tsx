// ชุด mock ทดสอบ
'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const mockData = [
  { date: '2025-06-01', avgPrice: 25500 },
  { date: '2025-06-02', avgPrice: 25750 },
  { date: '2025-06-03', avgPrice: 23000 },
];

export default function PriceTrendChart() {
  const chartData = {
    labels: mockData.map(d => d.date),
    datasets: [
      {
        label: 'ราคาเฉลี่ย (บาท)',
        data: mockData.map(d => d.avgPrice),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-600">📉 แนวโน้มราคาเฉลี่ย</h3>
      <Line data={chartData} />
    </div>
  );
}

// // ชุดนี้ดึงข้อมูล
// 'use client';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
// } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

// type AvgPriceData = {
//   date: string;
//   avgPrice: number;
// };

// export default function PriceTrendChart({ data }: { data: AvgPriceData[] }) {
//   const chartData = {
//     labels: data.map(d => d.date),
//     datasets: [
//       {
//         label: 'ราคาเฉลี่ย (บาท)',
//         data: data.map(d => d.avgPrice),
//         fill: false,
//         borderColor: 'rgb(75, 192, 192)',
//         tension: 0.3,
//       },
//     ],
//   };

//   return (
//     <div className="rounded-xl bg-white p-6 shadow">
//       <h3 className="mb-4 text-lg font-semibold text-gray-600">📉 แนวโน้มราคาเฉลี่ยรายวัน</h3>
//       {data.length > 0 ? (
//         <Line data={chartData} />
//       ) : (
//         <p className="text-sm text-gray-500">ยังไม่มีข้อมูล</p>
//       )}
//     </div>
//   );
// }
