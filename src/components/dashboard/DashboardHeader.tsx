// components/dashboard/DashboardHeader.tsx
"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();
  
  const switchRole = api.user.switchRole.useMutation({
    onSuccess: () => {
      setIsSwitching(false);
      router.refresh();
    },
  });
  
  const handleRoleSwitch = async () => {
    setIsSwitching(true);
    
    try {
      await switchRole.mutateAsync({
        userId: user.id,
      });
    } catch (error) {
      console.error("Failed to switch role:", error);
      setIsSwitching(false);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        {user.profileImage && (
          <img 
            src={user.profileImage} 
            alt={`${user.firstName} ${user.lastName}`}
            className="w-16 h-16 rounded-full mr-4 object-cover"
          />
        )}
        
        <div>
          <h1 className="text-2xl font-bold">
            Hello, {user.firstName}!
          </h1>
          <p className="text-gray-600">
            You are currently in {user.isFreelancer ? "Freelancer" : "Client"} mode
          </p>
        </div>
      </div>
      
      <button
        onClick={handleRoleSwitch}
        disabled={isSwitching}
        className="mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
      >
        {isSwitching 
          ? "Switching..." 
          : `Switch to ${user.isFreelancer ? "Client" : "Freelancer"} Mode`
        }
      </button>
    </div>
  );
}