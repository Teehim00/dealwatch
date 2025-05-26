// components/DealsFilter.tsx
export default function DealsFilter({
  search,
  store,
  sort,
  onSearchChange,
  onStoreChange,
  onSortChange,
  stores,
}: {
  search: string;
  store: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onStoreChange: (value: string) => void;
  onSortChange: (value: string) => void;
  stores: string[];
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row">
      {/* ช่องค้นหา */}
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="ค้นหาดีล..."
        className="w-full rounded border px-3 py-2 md:w-1/2"
      />

      {/* ตัวกรองร้านค้า */}
      <select
        value={store}
        onChange={e => onStoreChange(e.target.value)}
        className="w-full rounded border px-3 py-2 md:w-1/4"
      >
        <option value="">ทั้งหมด</option>
        {stores.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* ตัวเลือกเรียงราคา */}
      <select
        value={sort}
        onChange={e => onSortChange(e.target.value)}
        className="w-full rounded border px-3 py-2 md:w-1/4"
      >
        <option value="">เรียงตาม</option>
        <option value="lowToHigh">ราคาต่ำ → สูง</option>
        <option value="highToLow">ราคาสูง → ต่ำ</option>
      </select>
    </div>
  );
}
