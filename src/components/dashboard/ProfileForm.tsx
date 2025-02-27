// components/dashboard/ProfileForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { api } from "@/trpc/react";

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [username, setUsername] = useState(user.username || "");
  const [about, setAbout] = useState(user.about || "");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [socialLink, setSocialLink] = useState("");
  const [socialLinks, setSocialLinks] = useState<string[]>(user.socialLinks || []);
  const [contactInfo, setContactInfo] = useState<string[]>(user.contactInfo || []);
  const [contactDetail, setContactDetail] = useState("");
  
  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      router.push("/dashboard");
      router.refresh();
    },
  });
  
  const handleAddSkill = () => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
      setSkill("");
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };
  
  const handleAddSocialLink = () => {
    if (socialLink.trim() && !socialLinks.includes(socialLink.trim())) {
      setSocialLinks([...socialLinks, socialLink.trim()]);
      setSocialLink("");
    }
  };
  
  const handleRemoveSocialLink = (linkToRemove: string) => {
    setSocialLinks(socialLinks.filter(link => link !== linkToRemove));
  };
  
  const handleAddContactInfo = () => {
    if (contactDetail.trim() && !contactInfo.includes(contactDetail.trim())) {
      setContactInfo([...contactInfo, contactDetail.trim()]);
      setContactDetail("");
    }
  };
  
  const handleRemoveContactInfo = (infoToRemove: string) => {
    setContactInfo(contactInfo.filter(info => info !== infoToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      alert("Username is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        username,
        about,
        skills,
        socialLinks,
        contactInfo,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
      <div className="space-y-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username (required)
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Choose a unique username"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            This will be used for your profile URL: /profile/{username || "username"}
          </p>
        </div>
        
        {/* About */}
        <div>
          <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
            About
          </label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell clients about yourself, your experience, and expertise..."
          ></textarea>
        </div>
        
        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <div className="flex">
            <input
              type="text"
              id="skills"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a skill (e.g., JavaScript, UI Design)"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Social Links */}
        <div>
          <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700 mb-1">
            Social Links
          </label>
          <div className="flex">
            <input
              type="text"
              id="socialLinks"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a social link (e.g., https://github.com/yourusername)"
            />
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          {socialLinks.length > 0 && (
            <div className="mt-3 space-y-2">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialLink(link)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Contact Information */}
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Information
          </label>
          <div className="flex">
            <input
              type="text"
              id="contactInfo"
              value={contactDetail}
              onChange={(e) => setContactDetail(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add contact info (e.g., email@example.com, +1234567890)"
            />
            <button
              type="button"
              onClick={handleAddContactInfo}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          {contactInfo.length > 0 && (
            <div className="mt-3 space-y-2">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md">
                  <span>{info}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveContactInfo(info)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              px-6 py-3 rounded-md text-white font-medium
              ${isSubmitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}