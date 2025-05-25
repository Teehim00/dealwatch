import ChatRoom from '@/components/ChatRoom';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function ChatPage() {
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
          <div className="p-6">
            <ChatRoom />
          </div>
        </div>
      </div>
    </>
  );
}
