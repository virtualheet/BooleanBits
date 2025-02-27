// components/dashboard/RoleSelector.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

interface RoleSelectorProps {
  userId: string;
}

export default function RoleSelector({ userId }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<"freelancer" | "client" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const updateUserRole = api.user.updateRole.useMutation({
    onSuccess: () => {
      if (selectedRole === "freelancer") {
        router.push("/dashboard/profile");
      } else {
        router.push("/dashboard");
      }
    },
  });
  
  const handleRoleSelection = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    try {
      await updateUserRole.mutateAsync({
        userId,
        isFreelancer: selectedRole === "freelancer",
        isClient: selectedRole === "client",
      });
    } catch (error) {
      console.error("Failed to update role:", error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">How do you want to use Freelance Platform?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          className={`border rounded-lg p-6 cursor-pointer transition-all ${
            selectedRole === "freelancer" 
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => setSelectedRole("freelancer")}
        >
          <h3 className="text-xl font-semibold mb-2">Work as a Freelancer</h3>
          <p className="text-gray-600">
            Showcase your skills, find projects, and earn money by working with clients around the world.
          </p>
        </div>
        
        <div 
          className={`border rounded-lg p-6 cursor-pointer transition-all ${
            selectedRole === "client" 
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => setSelectedRole("client")}
        >
          <h3 className="text-xl font-semibold mb-2">Hire Freelancers</h3>
          <p className="text-gray-600">
            Post projects, find talented freelancers, and get your work done quickly and efficiently.
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleRoleSelection}
          disabled={!selectedRole || isLoading}
          className={`
            px-6 py-3 rounded-md text-white font-medium
            ${!selectedRole || isLoading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {isLoading ? "Processing..." : "Continue"}
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          Don&apos;t worry, you can always switch between roles later.
        </p>
      </div>
    </div>
  );
}