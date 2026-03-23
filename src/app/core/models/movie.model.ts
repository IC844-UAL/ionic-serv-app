export interface OMDbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDbSearchApiResponse {
  Search: OMDbMovie[];
  totalResults: string;
  Response: string;
}

export interface OMDbRating {
  Source: string;
  Value: string;
}

/** Full payload from OMDb `i=` (title/detail) requests. */
export interface OMDbMovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings?: OMDbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}
