'use client';

export default function DateFilter({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={selected}
      onChange={e => onChange(e.target.value)}
      className="rounded border bg-white px-3 py-2"
    >
      <option value="all">ทั้งหมด</option>
      <option value="7days">7 วันล่าสุด</option>
      <option value="30days">30 วันล่าสุด</option>
    </select>
  );
}
