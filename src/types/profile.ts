export interface UserProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  website?: string;
  social: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email: string;
}
