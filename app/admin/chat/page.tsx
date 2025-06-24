import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import AdminChatThreadList from '@/components/chat/AdminChatThreadList';

export default function AdminChatPage() {
  return (
    <>
      <Topbar />
      <div className="min-h-screen w-screen">
        <div className="flex min-h-screen w-full bg-black">
          {/* LEFT */}
          <div className="hidden border-r border-gray-700 p-4 xl:block xl:w-1/5">
            <Sidebar />
          </div>

          {/* RIGHT */}
          <div className="flex flex-1 flex-col gap-8 p-4">
            <AdminChatThreadList />
          </div>
        </div>
      </div>
    </>
  );
}
