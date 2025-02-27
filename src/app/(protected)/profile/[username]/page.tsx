// app/profile/[username]/page.tsx
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProfilePageProps {
  params: {
    username: string;
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  // Fetch user
  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  });
  
  if (!user) {
    return {
      title: "Profile Not Found",
    };
  }
  
  return {
    title: `${user.firstName} ${user.lastName} - Freelancer Profile`,
    description: user.about || `View ${user.firstName} ${user.lastName}'s freelancer profile.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;
  
  // Fetch the user with their portfolio projects
  const user = await db.user.findFirst({
    where: {
      username,
    },
    include: {
      portfolioProjects: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  
  if (!user) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-blue-600 text-white p-8">
          <div className="flex flex-col md:flex-row md:items-center">
            {user.profileImage && (
              <img
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white"
              />
            )}
            
            <div className="mt-4 md:mt-0 md:ml-6">
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              {user.isFreelancer && (
                <div className="mt-1 inline-block bg-blue-700 text-white text-sm px-3 py-1 rounded-full">
                  Freelancer
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Info */}
            <div className="md:col-span-1">
              <div className="space-y-6">
                {/* About Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">About</h2>
                  <p className="text-gray-700">
                    {user.about || "No information provided"}
                  </p>
                </div>
                
                {/* Skills Section */}
                {user.skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Social Links */}
                {user.socialLinks.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Connect</h2>
                    <div className="space-y-2">
                      {user.socialLinks.map((link, index) => (
                        <a 
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline"
                        >
                          {link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Contact Info */}
                {user.contactInfo.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Contact</h2>
                    <div className="space-y-2">
                      {user.contactInfo.map((info, index) => (
                        <p key={index} className="text-gray-700">
                          {info}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Portfolio */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
              
              {user.portfolioProjects.length > 0 ? (
                <div className="space-y-8">
                  {user.portfolioProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg overflow-hidden">
                      {project.images.length > 0 && (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-64 object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x300?text=No+Image";
                          }}
                        />
                      )}
                      
                      <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">
                    No portfolio projects available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}