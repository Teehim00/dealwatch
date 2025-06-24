'use client';
import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

export default function NewDealsChart() {
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/chart/new-deals?days=${days}`);
      const data = await res.json();
      setChartData(data);
    };
    fetchData();
  }, [days]);

  useEffect(() => {
    if (!Object.keys(chartData).length) return;

    const ctx = document.getElementById('deals-chart') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: `ดีลใหม่ในช่วง ${days} วัน`,
            data: Object.values(chartData),
            backgroundColor: '#3B82F6',
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    return () => {
      chart.destroy();
    };
  }, [chartData]);

  return (
    <div className="flex w-full flex-col rounded-lg bg-white p-4 shadow">
      <div className="mb-1">
        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="rounded border px-2 py-1 text-gray-700"
        >
          <option value={7}>7 วัน</option>
          <option value={15}>15 วัน</option>
          <option value={30}>30 วัน</option>
          <option value={90}>90 วัน</option>
          <option value={365}>1 ปี</option>
        </select>
      </div>
      <canvas id="deals-chart" height={200}></canvas>
    </div>
  );
}
