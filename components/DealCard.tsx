// components/DealCard.tsx
export default function DealCard({
  title,
  store,
  price,
}: {
  title: string;
  store: string;
  price: number;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{store}</p>
      <p className="mt-2 font-semibold text-green-600">{price.toLocaleString()} ฿</p>
    </div>
  );
}
