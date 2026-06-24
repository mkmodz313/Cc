export interface BioItem {
  id: number;
  text: string;
  category: string;
  likes: number;
}

export interface PresetCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface StylistFontPreset {
  id: string;
  name: string;
  transform: (text: string) => string;
}

export interface FacebookProfileState {
  name: string;
  isVerified: boolean;
  avatarUrl: string;
  coverUrl: string;
  bioText: string;
  hobbies: string[];
  followersCount: string;
  workplace: string;
  homeTown: string;
  relationshipStatus: string;
  // Gold-Metallic card customized fields
  subject?: string;
  diploma?: string;
  profession?: string;
  speciality?: string;
  expertise?: string;
  phone?: string;
  email?: string;
}
