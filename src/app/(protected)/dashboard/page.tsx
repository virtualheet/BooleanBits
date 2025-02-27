// app/dashboard/page.tsx
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RoleSelector from "@/components/dashboard/dashboard";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Fetch the user data
  const user = await db.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    redirect("/");
  }
  
  // If user is neither a freelancer nor a client, show role selection
  if (!user.isFreelancer && !user.isClient) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Welcome to Freelance Platform</h1>
        <RoleSelector userId={userId} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <DashboardHeader user={user} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          {/* Dashboard content based on role */}
          {user.isFreelancer && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Freelancer Dashboard</h2>
              {/* Freelancer specific content */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Active Projects</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Proposals</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Earnings</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>
              
              {/* Complete profile prompt if needed */}
              {(!user.about || user.socialLinks.length === 0 || user.skills.length === 0) && (
                <div className="mt-6 bg-blue-50 p-4 rounded-md">
                  <h3 className="text-md font-medium text-blue-800">Complete your profile</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Complete your profile to increase your chances of getting hired.
                  </p>
                  <a 
                    href="/dashboard/profile"
                    className="mt-2 inline-block text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Complete Profile
                  </a>
                </div>
              )}
            </div>
          )}
          
          {user.isClient && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Client Dashboard</h2>
              {/* Client specific content */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Active Projects</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {user.isFreelancer && (
                <>
                  <a 
                    href="/dashboard/profile"
                    className="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Edit Profile
                  </a>
                  <a 
                    href="/dashboard/portfolio"
                    className="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Manage Portfolio
                  </a>
                  <a 
                    href="/projects/browse"
                    className="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Find Projects
                  </a>
                </>
              )}
              
              {user.isClient && (
                <>
                  <a 
                    href="/dashboard/profile"
                    className="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Edit Profile
                  </a>
                  <a 
                    href="/projects/post"
                    className="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Post a Project
                  </a>
                  <a 
                    href="/freelancers/browse"
                    className="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Find Freelancers
                  </a>
                </>
              )}
              
              <button 
                className="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-blue-600"
                onClick={() => {
                  // This will be handled by client component with trpc
                }}
              >
                Switch to {user.isFreelancer ? "Client" : "Freelancer"} Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}