import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "founder" | "investor" | "business" | "general";

export interface UserProfile {
  role: UserRole;
  name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  avatar: string;
  // role-specific
  university?: string;
  course?: string;
  gradYear?: string;
  startupName?: string;
  startupCategory?: string;
  investorType?: string;
  investmentRange?: string;
  businessName?: string;
  businessIndustry?: string;
  interests?: string;
}

interface ProfileContextValue {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  setProfile: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
