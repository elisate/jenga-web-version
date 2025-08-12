"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { 
  User, 
  Building, 
  Lock, 
  Shield,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        setUser(user);
        
        // Fetch profile
        const { data: profileData } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          
          // Fetch organization
          const { data: orgData } = await supabaseClient
            .from("organizations")
            .select("*")
            .eq("id", profileData.organization_id)
            .single();
          
          if (orgData) {
            setOrganization(orgData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-slate-600 mt-1">Manage your account and preferences</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-violet-600" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-slate-600">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Avatar */}
              {profile?.avatar_url && (
                <div className="flex justify-center mb-4">
                  <Image src={profile.avatar_url} alt="Avatar" width={64} height={64} className="w-16 h-16 rounded-full border" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">First Name</Label>
                  <Input 
                    defaultValue={profile?.first_name || ""}
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Last Name</Label>
                  <Input 
                    defaultValue={profile?.last_name || ""}
                    className="border-2 border-slate-200 focus:border-violet-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Email</Label>
                <Input 
                  defaultValue={user?.email || ""}
                  type="email"
                  disabled
                  className="border-2 border-slate-200 bg-slate-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Phone</Label>
                <Input 
                  defaultValue={profile?.phone || ""}
                  type="tel"
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">ID Number</Label>
                <Input 
                  defaultValue={profile?.id_number || ""}
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Role</Label>
                <Input 
                  defaultValue={profile?.role || ""}
                  className="border-2 border-slate-200 focus:border-violet-500"
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Title</Label>
                <Input 
                  defaultValue={profile?.title || ""}
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Signature</Label>
                <Input 
                  type="file"
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Last Updated</Label>
                <Input 
                  defaultValue={profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : ""}
                  className="border-2 border-slate-200 focus:border-violet-500"
                  disabled
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Organization Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-violet-600" />
                Organization Settings
              </CardTitle>
              <CardDescription className="text-slate-600">
                Manage your organization details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Organization Name</Label>
                <Input 
                  defaultValue={organization?.name || ""}
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Email</Label>
                <Input 
                  defaultValue={organization?.email || ""}
                  type="email"
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Phone</Label>
                <Input 
                  defaultValue={organization?.phone || ""}
                  type="tel"
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Address</Label>
                <Input 
                  defaultValue={organization?.address || ""}
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Website</Label>
                <Input 
                  defaultValue={organization?.website || ""}
                  type="url"
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Organization
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-600" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-slate-600">
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Current Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    className="border-2 border-slate-200 focus:border-violet-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-violet-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">New Password</Label>
                <div className="relative">
                  <Input 
                    type={showNewPassword ? "text" : "password"}
                    className="border-2 border-slate-200 focus:border-violet-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-violet-500"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"}
                    className="border-2 border-slate-200 focus:border-violet-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-violet-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 
