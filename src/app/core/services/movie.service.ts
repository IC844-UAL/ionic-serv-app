import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OMDbMovie, OMDbMovieDetail, OMDbSearchApiResponse } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private readonly API_URL = `https://www.omdbapi.com/?apikey=${environment.apiKeyOMDb}`;

  // 1. Private Signals for State 
  private _movies = signal<OMDbMovie[]>([]);
  private _favorites = signal<OMDbMovie[]>([]);
  private _currentMovie = signal<OMDbMovieDetail | null>(null);

  // 2. Public Read-Only Exposures
  public movies = this._movies.asReadonly();
  public favorites = this._favorites.asReadonly();
  public currentMovie = this._currentMovie.asReadonly();

  // 3. Computed Signals (Automatic Counters) 
  public totalResults = computed(() => this._movies().length);
  public favoriteCount = computed(() => this._favorites().length);

  // 4. Methods to update state
  searchMovies(title: string) {
    this.http.get<OMDbSearchApiResponse>(`${this.API_URL}&s=${title}`)
      .subscribe(response => {
        if (response.Response === 'True' && response.Search) {
          // Remove duplicates returned by OMDb (same imdbID multiple times)
          const unique = new Map<string, OMDbMovie>();
          for (const m of response.Search) {
            if (!m?.imdbID) continue;
            if (!unique.has(m.imdbID)) {
              unique.set(m.imdbID, m);
            }
          }
          this._movies.set(Array.from(unique.values()));
        } else {
          this._movies.set([]);
        }
      });
  }

  getMovieDetails(id: string) {
    this._currentMovie.set(null);
    this.http.get<OMDbMovieDetail>(`${this.API_URL}&i=${id}`).subscribe((movie) => {
      if (movie.Response === 'True') {
        this._currentMovie.set(movie);
      } else {
        this._currentMovie.set(null);
      }
    });
  }

  toggleFavorite(movie: OMDbMovie) {
    const current = this._favorites();
    const isFav = current.some(m => m.imdbID === movie.imdbID);

    if (isFav) {
      this._favorites.set(current.filter(m => m.imdbID !== movie.imdbID));
    } else {
      this._favorites.set([...current, movie]);
    }
  }
}