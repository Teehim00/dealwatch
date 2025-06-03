// 'use client';
// import { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { supabase } from '@/lib/supabase';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// const DATE_RANGE_OPTIONS = [7, 14, 30];

// export default function DealsTrendChart() {
//   const [chartData, setChartData] = useState<any>(null);
//   const [rangeDays, setRangeDays] = useState(7);

//   useEffect(() => {
//     const fetchData = async () => {
//       const fromDate = new Date();
//       fromDate.setDate(fromDate.getDate() - rangeDays);

//       const { data, error } = await supabase
//         .from('deals')
//         .select('id, created_at')
//         .gte('created_at', fromDate.toISOString());

//       if (error) {
//         console.error('❌ Supabase Chart error:', error);
//         return;
//       }

//       const counts: { [date: string]: number } = {};

//       data.forEach((deal: any) => {
//         const date = new Date(deal.created_at).toLocaleDateString('en-CA'); // YYYY-MM-DD
//         counts[date] = (counts[date] || 0) + 1;
//       });

//       const sortedDates = Object.keys(counts).sort();
//       const chartConfig = {
//         labels: sortedDates,
//         datasets: [
//           {
//             label: 'จำนวนดีลที่เพิ่ม',
//             data: sortedDates.map(date => counts[date]),
//             fill: false,
//             borderColor: '#3B82F6',
//             tension: 0.1,
//           },
//         ],
//       };

//       setChartData(chartConfig);
//     };

//     fetchData();
//   }, [rangeDays]);

//   return (
//     <div className="rounded-xl bg-white p-6 shadow">
//       <div className="mb-4 flex justify-between items-center">
//         <h3 className="text-lg font-semibold">📈 แนวโน้มดีลรายวัน</h3>
//         <select
//           className="rounded border px-2 py-1 text-sm"
//           value={rangeDays}
//           onChange={e => setRangeDays(Number(e.target.value))}
//         >
//           {DATE_RANGE_OPTIONS.map(d => (
//             <option key={d} value={d}>
//               {d} วันล่าสุด
//             </option>
//           ))}
//         </select>
//       </div>
//       {chartData ? <Line data={chartData} /> : <p>กำลังโหลดกราฟ...</p>}
//     </div>
//   );
// }
