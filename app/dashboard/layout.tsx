import SidebarDash from "@/components/ui/sidebar-dash";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 min-h-screen">
      {/* Sidebar */}
      <SidebarDash />
      {/* Main Content Area */}
      <main className="md:ml-64 flex-1 overflow-hidden">
        {/* Content with proper spacing and background */}
        <div className="h-full overflow-y-auto">
          <div className="min-h-full bg-white/40 backdrop-blur-sm">
            <div className="p-4 md:p-8">
              {/* Content container with max width and centering */}
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}