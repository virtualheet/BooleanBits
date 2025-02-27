// app/dashboard/profile/page.tsx
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
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
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        {user.about ? "Edit Your Profile" : "Complete Your Profile"}
      </h1>
      
      <ProfileForm user={user} />
    </div>
  );
}