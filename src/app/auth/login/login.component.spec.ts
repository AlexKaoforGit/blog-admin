import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth.service';
import { SweetAlertService } from '../../core/sweet-alert.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSweetAlert: jasmine.SpyObj<SweetAlertService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const sweetAlertSpy = jasmine.createSpyObj('SweetAlertService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SweetAlertService, useValue: sweetAlertSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSweetAlert = TestBed.inject(
      SweetAlertService
    ) as jasmine.SpyObj<SweetAlertService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when email is empty', () => {
    component.loginForm.patchValue({ email: '', password: 'password123' });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should mark form as invalid when password is empty', () => {
    component.loginForm.patchValue({ email: 'test@example.com', password: '' });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should mark form as valid when both fields are filled', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should return correct error message for required email', () => {
    component.loginForm.get('email')?.markAsTouched();
    const errorMessage = component.getErrorMessage('email');
    expect(errorMessage).toBe('Email為必填欄位');
  });

  it('should return correct error message for required password', () => {
    component.loginForm.get('password')?.markAsTouched();
    const errorMessage = component.getErrorMessage('password');
    expect(errorMessage).toBe('密碼為必填欄位');
  });

  it('should call router navigate when goToRegister is called', () => {
    component.goToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should call router navigate when goToHome is called', () => {
    component.goToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/blog']);
  });
});
