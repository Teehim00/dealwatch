import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

// app/stores/page.tsx
export default function StoresPage() {
  return (
    <>
      <Topbar />
      <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
        {/* LEFT */}
        <div className="hidden w-full xl:block xl:w-1/5">
          <div className="h-full rounded-md">
            <Sidebar />
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex w-full flex-col gap-8 xl:w-2/2">
          <main className="bg-blue-700 p-6">
            <h1 className="mb-4 text-3xl font-bold">🏬 Stores</h1>
            <ul className="space-y-4">
              {['Shopee', 'Lazada', 'JD Central'].map(store => (
                <li key={store} className="rounded-lg bg-white p-4 shadow hover:bg-gray-50">
                  <h2 className="text-xl font-semibold">{store}</h2>
                  <p className="text-gray-500">ดูโปรโมชันทั้งหมดในร้านนี้</p>
                </li>
              ))}
            </ul>
          </main>
        </div>
      </div>
    </>
  );
}
