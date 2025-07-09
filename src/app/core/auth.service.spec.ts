import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockAngularFireAuth: jasmine.SpyObj<AngularFireAuth>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireAuth', [
      'signInWithEmailAndPassword',
      'createUserWithEmailAndPassword',
      'signOut',
    ]);
    spy.authState = of(null);

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: AngularFireAuth, useValue: spy }],
    });
    service = TestBed.inject(AuthService);
    mockAngularFireAuth = TestBed.inject(
      AngularFireAuth
    ) as jasmine.SpyObj<AngularFireAuth>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have currentUser$ observable', () => {
    expect(service.currentUser$).toBeDefined();
  });

  it('should have isAuthenticated method', () => {
    expect(service.isAuthenticated).toBeDefined();
  });

  it('should have getCurrentUser method', () => {
    expect(service.getCurrentUser).toBeDefined();
  });

  it('should initially have no current user', (done) => {
    service.currentUser$.subscribe((user) => {
      expect(user).toBeNull();
      done();
    });
  });

  it('should return false for initial authentication state', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should initially return null for current user', () => {
    expect(service.getCurrentUser()).toBeNull();
  });
});
