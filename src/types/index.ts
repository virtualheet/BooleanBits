// src/types/index.ts
export type SocialLink = {
    platform: string;
    url: string;
  };
  
  export type Project = {
    title: string;
    description: string;
    link: string;
  };
  
  export type UserProfile = {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    isFreelancer: boolean;
    isClient: boolean;
    about: string | null;
    socialLinks: string[];
    skills: string[];
    works: string[];
  };