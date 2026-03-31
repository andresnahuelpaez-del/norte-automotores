import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page has its own layout needs — handled by middleware
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {user && <AdminSidebar />}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
