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
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      <div className="flex h-full flex-col justify-between rounded-lg border bg-white p-4 shadow transition hover:shadow-lg">
        <img src={image} alt={title} className="mb-4 h-full w-full rounded object-cover" />
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg font-bold" title={title}>
            {title}
          </h3>
          <p className="text-sm text-gray-500">{store}</p>
        </div>
        <p className="mt-2 text-right text-lg font-semibold text-green-600">{price} ฿</p>
      </div>
    </a>
  );
}
