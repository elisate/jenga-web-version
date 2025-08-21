"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, FileText, Settings, LogOut, BarChart3, User, Users, Clipboard, Building,ReplyIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
  { label: "Valuations", href: "/dashboard/newvaluation", icon: <FileText className="w-5 h-5" /> },
  { label: "Properties", href: "/dashboard/properties", icon: <Building className="w-5 h-5" /> },
  { label: "Templates", href: "/dashboard/templates", icon: <Clipboard className="w-5 h-5" /> },
  { label: "Users", href: "/dashboard/users", icon: <Users className="w-5 h-5" /> },
  { label: "Report", href: "/dashboard/report", icon: <ReplyIcon className="w-5 h-5" /> },
];

export default function SidebarDash() {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        const { data: profileData } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (profileData) setProfile(profileData);
      }
    }
    fetchProfile();
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-violet-900 via-purple-900 to-violet-800 text-white flex flex-col shadow-2xl border-r border-violet-700/50 z-40 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none">
        <div className="absolute top-20 left-4 w-32 h-32 bg-violet-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-violet-700/50 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
              Zenger
            </h2>
            <p className="text-violet-300 text-sm">Valuation Portal</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-hidden">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg text-white"
                    : "hover:bg-violet-800/50 text-violet-200 hover:text-white"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"></div>
                )}
                <div className={`transition-colors duration-300 ${isActive ? "text-white" : "text-violet-300 group-hover:text-white"}`}>
                  {item.icon}
                </div>
                <span className="font-medium relative z-10">{item.label}</span>
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-violet-700/50 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-violet-800/50 mb-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{profile ? `${profile.first_name} ${profile.last_name}` : "My Profile"}</p>
            <p className="text-violet-300 text-xs">My Profile</p>
          </div>
          {/* Settings button in profile section */}
          <Button
            variant="ghost"
            className="p-2 text-violet-200 hover:text-white hover:bg-violet-800/50 transition-all duration-300"
            onClick={() => router.push("/dashboard/settings")}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </motion.div>
        <Button
          variant="ghost"
          className="w-full flex items-center gap-3 text-violet-200 hover:text-white hover:bg-violet-800/50 transition-all duration-300 group"
          onClick={async () => {
            await supabaseClient.auth.signOut();
            router.push("/");
          }}
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}