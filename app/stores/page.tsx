// // app/stores/page.tsx
// 'use client';

// import Sidebar from '@/components/Sidebar';
// import Topbar from '@/components/Topbar';
// import StoreCard from '@/components/StoreCard';
// import { useEffect, useState } from 'react';

// type Store = {
//   id: number;
//   name: string;
//   logo: string;
//   dealCount: number;
// };

// export default function StoresPage() {
//   const [stores, setStores] = useState<Store[]>([]);
//   const [loading, setLoading] = useState(true);
//   console.log('📦 Stores:', stores);

//   useEffect(() => {
//     const fetchStores = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch('http://localhost:3001/api/stores');
//         const data = await res.json();
//         setStores(data);
//       } catch (err) {
//         console.error('Error fetching stores:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStores();
//   }, []);

//   return (
//     <>
//       <Topbar />
//       <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
//         {/* LEFT */}
//         <div className="hidden w-full xl:block xl:w-1/5">
//           <div className="h-full rounded-md">
//             <Sidebar />
//           </div>
//         </div>
//         {/* RIGHT */}
//         <div className="flex w-full flex-col gap-8 xl:w-2/2">
//           <div className="p-4">
//             <h2 className="mb-4 text-2xl font-bold">🏪 ร้านค้าทั้งหมด</h2>

//             {loading ? (
//               <p className="text-gray-500">กำลังโหลดข้อมูลร้านค้า...</p>
//             ) : stores.length === 0 ? (
//               <p className="text-gray-500">ไม่พบร้านค้า</p>
//             ) : (
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {stores.map(store => (
//                   <StoreCard key={store.id} {...store} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
