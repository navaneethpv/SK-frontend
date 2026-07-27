export interface ISlide {
  id: number;
  title?: string;
  subtitle?: string;
  image?: string;
  img?: string;
  link?: string;
  url?: string;
  is_active?: boolean;
}

export interface IFlair {
  id: number;
  title?: string;
  badge_text?: string;
  badge_type?: string;
  is_active?: boolean;
}

export interface ISocialMedia {
  id: number;
  name?: string;
  platform?: string;
  url?: string;
  icon?: string;
}

export interface IVideoBanner {
  id: number;
  title?: string;
  video_url?: string;
  video?: string;
  thumbnail?: string;
  link?: string;
}

export interface IPolicy {
  id: number;
  title?: string;
  slug?: string;
  content?: string;
}

export interface IAbout {
  id: number;
  title?: string;
  content?: string;
  logo?: string;
  description?: string;
}

export interface IBlog {
  id: number;
  title: string;
  content?: string;
  author?: string;
  created_at?: string;
  image?: string;
  img?: string;
  slug?: string;
}

export interface IVersion {
  version: string;
  release_date?: string;
}

export interface ITestimonial {
  id: number;
  name: string;
  rating: number;
  quote?: string;
  review?: string;
  verified?: boolean;
}

export interface ISearchHint {
  id: number;
  title: string;
  type?: string;
}

export interface IAuthor {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
}
