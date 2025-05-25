// components/StoreCard.tsx
export default function StoreCard({ name }: { name: string }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow hover:bg-gray-50">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-500">ดูโปรโมชันทั้งหมดในร้านนี้</p>
      </div>
    )
  }
  