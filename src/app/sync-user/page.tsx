import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

const SyncUser = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("User not found");
  }
  
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  if (!user.emailAddresses[0]?.emailAddress) {
    throw notFound();
  }
  
  await db.user.upsert({
    where: {
      email: user.emailAddresses[0]?.emailAddress ?? "",
    },
    update: {
      profileImage: user.imageUrl,
      firstName: user.firstName ?? "", // Add fallback to empty string
      lastName: user.lastName ?? "",   // Add fallback to empty string
    },
    create: {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      profileImage: user.imageUrl,
      firstName: user.firstName ?? "", // Add fallback to empty string
      lastName: user.lastName ?? "",   // Add fallback to empty string
    },
  });
  
  return redirect("/dashboard");
};
export default SyncUser