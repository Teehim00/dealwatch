// components/DealsFilter.tsx
export default function DealsFilter({
  search,
  store,
  onSearchChange,
  onStoreChange,
  stores,
}: {
  search: string;
  store: string;
  onSearchChange: (value: string) => void;
  onStoreChange: (value: string) => void;
  stores: string[];
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row">
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="ค้นหาดีล..."
        className="w-full rounded border px-3 py-2 md:w-1/2"
      />
      <select
        value={store}
        onChange={e => onStoreChange(e.target.value)}
        className="w-full rounded border px-3 py-2 md:w-1/3"
      >
        <option value="">ทั้งหมด</option>
        {stores.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
