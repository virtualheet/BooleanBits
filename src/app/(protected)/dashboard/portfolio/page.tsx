// app/dashboard/portfolio/page.tsx
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PortfolioManager from "@/components/dashboard/PortfolioManager";

export default async function PortfolioPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Fetch the user data with portfolio projects
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      portfolioProjects: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  
  if (!user) {
    redirect("/");
  }
  
  // Check if user is a freelancer
  if (!user.isFreelancer) {
    redirect("/dashboard");
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Portfolio Projects</h1>
        <a 
          href="/dashboard" 
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
        >
          Back to Dashboard
        </a>
      </div>
      
      <PortfolioManager user={user} portfolioProjects={user.portfolioProjects} />
    </div>
  );
}