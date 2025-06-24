// components/DealCard.tsx

import Link from 'next/link';

export default function DealCard({
  id,
  title,
  store,
  price,
  image,
}: {
  id: string; 
  title: string;
  store: string;
  price: number;
  image: string;
}) {
  return (
    <Link href={`/deals/${id}`} className="block h-full">
      <div className="flex h-full flex-col justify-between overflow-hidden rounded-lg border bg-white p-4 shadow transition hover:shadow-xl">
        <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex-1">
          <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-800" title={title}>
            {title}
          </h3>
          <p className="text-sm text-gray-500">{store}</p>
        </div>

        <p className="mt-2 text-right text-lg font-bold text-green-600">
          {price.toLocaleString()} ฿
        </p>
      </div>
    </Link>
  );
}
