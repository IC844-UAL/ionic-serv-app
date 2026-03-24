import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { MovieService } from 'src/app/core/services/movie.service';
import { OMDbMovie } from 'src/app/core/models/movie.model';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const movieServiceMock = {
    searchMovies: jasmine.createSpy('searchMovies'),
    movies: () => [],
    favoriteCount: () => 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage], // standalone component
      providers: [{ provide: MovieService, useValue: movieServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchMovies when query length > 2', () => {
    const event = { detail: { value: 'batman' } } as CustomEvent<{ value: string }>;

    component.onSearch(event);

    expect(movieServiceMock.searchMovies).toHaveBeenCalledWith('batman');
  });

  it('should not call searchMovies when query length <= 2', () => {
    movieServiceMock.searchMovies.calls.reset();
    const event = { detail: { value: 'ab' } } as CustomEvent<{ value: string }>;

    component.onSearch(event);

    expect(movieServiceMock.searchMovies).not.toHaveBeenCalled();
  });

  it('posterSrc should normalize http URL to https', () => {
    const movie: OMDbMovie = {
      Title: 'Test',
      Year: '2024',
      imdbID: 'tt1234567',
      Type: 'movie',
      Poster: 'http://example.com/poster image.jpg',
    };

    const src = component.posterSrc(movie);

    expect(src).toBe('https://example.com/poster%20image.jpg');
  });

  it('posterSrc should return null after poster error for that movie', () => {
    const movie: OMDbMovie = {
      Title: 'Test',
      Year: '2024',
      imdbID: 'tt7654321',
      Type: 'movie',
      Poster: 'https://example.com/poster.jpg',
    };

    component.onPosterError(movie.imdbID);

    expect(component.posterSrc(movie)).toBeNull();
  });
});