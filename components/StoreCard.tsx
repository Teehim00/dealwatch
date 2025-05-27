// components/StoreCard.tsx
export default function StoreCard({
  name,
  logo,
  dealCount,
}: {
  name: string;
  logo: string;
  dealCount: number;
}) {
  return (
    <div className="rounded-lg border p-4 shadow-sm transition hover:shadow-md">
      <img src={logo} alt={name} className="mb-2 h-16 w-16 object-contain" />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{dealCount} ดีล</p>
    </div>
  );
}
