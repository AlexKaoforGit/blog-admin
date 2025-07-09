import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { of, BehaviorSubject } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let currentUserSubject: BehaviorSubject<any>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject(null);
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: currentUserSubject.asObservable(),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login when user is not authenticated', (done) => {
    currentUserSubject.next(null);

    const result = guard.canActivate();
    if (result instanceof Promise) {
      result.then((canActivate) => {
        expect(canActivate).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    } else if (typeof result === 'object' && 'subscribe' in result) {
      result.subscribe((canActivate) => {
        expect(canActivate).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    }
  });

  it('should allow access when user is authenticated', (done) => {
    const mockUser = { email: 'test@example.com', name: 'Test User' };
    currentUserSubject.next(mockUser);

    const result = guard.canActivate();
    if (result instanceof Promise) {
      result.then((canActivate) => {
        expect(canActivate).toBeTrue();
        done();
      });
    } else if (typeof result === 'object' && 'subscribe' in result) {
      result.subscribe((canActivate) => {
        expect(canActivate).toBeTrue();
        done();
      });
    }
  });
});
