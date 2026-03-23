import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { MovieService } from 'src/app/core/services/movie.service';
import { OMDbMovie, OMDbMovieDetail } from 'src/app/core/models/movie.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    TitleCasePipe,
    IonContent,
    IonButtons,
    IonBackButton,
    IonIcon,
  ],
})
export class DetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  public movieService = inject(MovieService);

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movieService.getMovieDetails(id);
    }
  }

  isFavorite(movieId: string): boolean {
    return this.movieService.favorites().some((m) => m.imdbID === movieId);
  }

  toFavoriteMovie(d: OMDbMovieDetail): OMDbMovie {
    return {
      Title: d.Title,
      Year: d.Year,
      imdbID: d.imdbID,
      Type: d.Type,
      Poster: d.Poster,
    };
  }

  splitGenres(genre: string | undefined): string[] {
    if (!genre?.trim() || genre === 'N/A') {
      return [];
    }
    return genre.split(',').map((g) => g.trim()).filter(Boolean);
  }

  hasValue(v: string | undefined): boolean {
    return !!v && v.trim().length > 0 && v !== 'N/A';
  }

  ratingShortLabel(source: string): string {
    if (source.includes('Internet Movie Database')) {
      return 'IMDb';
    }
    if (source.includes('Rotten Tomatoes')) {
      return 'Rotten Tomatoes';
    }
    if (source.includes('Metacritic')) {
      return 'Metacritic';
    }
    return source;
  }

  posterUrl(movie: OMDbMovieDetail): string | null {
    if (movie.Poster && movie.Poster !== 'N/A') {
      return movie.Poster;
    }
    return null;
  }
}
