/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnimeResult = {
  data: Anime;
};

export type Anime = {
  mal_id: number;
  url: string;
  images: { [key: string]: Image };
  trailer: Trailer;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: null;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: null;
  scored_by: null;
  rank: null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: null;
  season: null;
  year: null;
  broadcast: Broadcast;
  producers: Demographic[];
  licensors: any[];
  studios: any[];
  genres: Genre[];
  explicit_genres: Genre[];
  themes: Demographic[];
  demographics: Demographic[];
};

export type Genre = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

export type Aired = {
  from: Date;
  to: null;
  prop: Prop;
  string: string;
};

export type Prop = {
  from: From;
  to: From;
};

export type From = {
  day: number | null;
  month: number | null;
  year: number | null;
};

export type Broadcast = {
  day: null;
  time: null;
  timezone: null;
  string: null;
};

export type Demographic = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

export type Image = {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
};

export type Title = {
  type: string;
  title: string;
};

export type Trailer = {
  youtube_id: null;
  url: null;
  embed_url: null;
  images: Images;
};

export type Images = {
  image_url: null;
  small_image_url: null;
  medium_image_url: null;
  large_image_url: null;
  maximum_image_url: null;
};
