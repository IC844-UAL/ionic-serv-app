import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DetailsPage } from './details.page';
import { MovieService } from 'src/app/core/services/movie.service';

describe('DetailsPage', () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;

  const movieServiceMock = {
    getMovieDetails: jasmine.createSpy('getMovieDetails'),
    currentMovie: () => null,
    favorites: () => [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPage],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? 'tt1234567' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie details when route id is present', () => {
    expect(movieServiceMock.getMovieDetails).toHaveBeenCalledWith('tt1234567');
  });
});
