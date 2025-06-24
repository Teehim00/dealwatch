import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import AdminChatRoom from '@/components/chat/AdminChatRoom';

export default function AdminChatRoomPage() {
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
          <div className="flex flex-1 items-start justify-center p-2">
            <div className="h-[900px] w-5/5 overflow-hidden rounded-md p-2 shadow-lg">
              <AdminChatRoom />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
