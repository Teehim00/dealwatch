// components/DealCard.tsx
export default function DealCard({
  title,
  store,
  price,
  image,
  link,
}: {
  title: string;
  store: string;
  price: number;
  image: string;
  link: string;
}) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      <div className="rounded-lg border bg-white p-4 shadow transition hover:shadow-md">
        <img src={image} alt={title} className="mb-4 h-48 w-full rounded object-cover" />
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{store}</p>
        {/* <p className="mt-2 font-semibold text-green-600">{price.toLocaleString()} ฿</p> */}
      </div>
    </a>
  );
}
