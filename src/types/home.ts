export interface ISlide {
  id: number;
  title?: string;
  sub_title?: string;
  subtitle?: string;
  desc?: string;
  link1?: string;
  link2?: string;
  link?: string;
  url?: string;
  priority?: number;
  visible_time?: number;
  file?: string;
  popup?: string;
  image?: string;
  img?: string;
  is_active?: boolean;
}

export interface IFlair {
  id: number;
  title?: string;
  subtitle?: string;
  link1?: string;
  link2?: string;
  priority?: number;
  flair?: string;
  media?: string;
  badge_text?: string;
  badge_type?: string;
  is_active?: boolean;
}

export interface ISocialMedia {
  id: number;
  title?: string;
  name?: string;
  link?: string;
  url?: string;
  platform?: string;
  icon?: string;
}

export interface IVideoBanner {
  id: number;
  title?: string;
  embedded_url?: string;
  video_url?: string;
  video?: string;
  time?: string;
  is_autoplay?: boolean;
  priority?: number;
  thumbnail?: string;
  link?: string;
}

export interface IPolicy {
  id: number;
  title?: string;
  slug?: string;
  content?: string;
  policy1?: string;
  policy2?: string;
  policy3?: string;
  privacy1?: string;
  privacy2?: string;
  privacy3?: string;
  cookies?: string;
  terms1?: string;
  terms2?: string;
  terms3?: string;
  supportPerson?: string;
  contact?: string;
  email?: string;
  accountDeleteURL?: string;
}

export interface IAbout {
  id: number;
  title?: string;
  para1?: string;
  para2?: string;
  para3?: string;
  img1?: string;
  img2?: string;
  img3?: string;
  content?: string;
  logo?: string;
  description?: string;
}

export interface IBlogComment {
  id: number;
  comment: string;
  Reference_comment?: number | null;
  user_id?: number;
}

export interface IBlog {
  id: number;
  title?: string;
  head?: string;
  sub_head?: string;
  description?: string;
  content?: string;
  paragraph_1?: string;
  paragraph_2?: string;
  paragraph_3?: string;
  author?: string;
  date?: string;
  created_at?: string;
  image?: string;
  img?: string;
  imagebanner?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  videourl?: string;
  user?: number;
  like?: number;
  comment?: IBlogComment[];
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
