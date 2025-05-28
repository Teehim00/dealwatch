// import AdminChatRoom from '@/components/AdminChatRoom';

// export default function AdminChatPage() {
//   return (
//     <main className="min-h-screen bg-gray-100 p-6">
//       <AdminChatRoom />
//     </main>
//   );
// }

//app/chat/page.tsx
import AdminChatRoom from '@/components/AdminChatRoom';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function AdminChatPage() {
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
          <main className="min-h-screen bg-gray-100 p-6">
            <AdminChatRoom />
          </main>
        </div>
      </div>
    </>
  );
}
