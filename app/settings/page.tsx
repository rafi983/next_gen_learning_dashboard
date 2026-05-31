import Sidebar from "@/components/Sidebar";
import Stub from "@/components/Stub";

export default function SettingsPage() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#08090d" }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
        <Stub title="Settings" />
      </main>
    </div>
  );
}
