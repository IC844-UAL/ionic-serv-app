import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonBadge,
  IonIcon,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';
import { OMDbMovie } from 'src/app/core/models/movie.model';
import { MovieService } from 'src/app/core/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonBadge,
    IonIcon,
    RouterLink,
  ],
})
export class HomePage {
  public movieService = inject(MovieService);
  private brokenPosterIds = new Set<string>();

  constructor() {
    addIcons({ heart });
  }

  onSearch(event: CustomEvent<{ value?: string | null }>) {
    const query = event.detail?.value;
    if (query && query.trim().length > 2) {
      this.movieService.searchMovies(query);
    }
  }

  posterSrc(movie: OMDbMovie): string | null {
    if (this.brokenPosterIds.has(movie.imdbID)) {
      return null;
    }

    const raw = movie.Poster?.trim();
    if (!raw || raw === 'N/A' || !/^https?:\/\//i.test(raw)) {
      return null;
    }

    return encodeURI(raw).replace(/^http:\/\//i, 'https://');
  }

  onPosterError(movieId: string): void {
    this.brokenPosterIds.add(movieId);
  }
}