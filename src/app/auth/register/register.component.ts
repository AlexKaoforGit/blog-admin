import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { SweetAlertService } from '../../core/sweet-alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { name, email, password } = this.registerForm.value;

      this.authService.register(email, password, name).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.sweetAlert.success('註冊成功', '歡迎加入！');
            this.router.navigate(['/articles']);
          } else {
            this.sweetAlert.error('註冊失敗', '請檢查您的資料或稍後再試');
          }
        },
        error: () => {
          this.loading = false;
          this.sweetAlert.error('註冊失敗', '註冊時發生錯誤，請稍後再試');
        },
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) {
      const fieldNames: { [key: string]: string } = {
        name: '姓名',
        email: 'Email',
        password: '密碼',
        confirmPassword: '確認密碼',
      };
      return `${fieldNames[fieldName]}為必填欄位`;
    }
    if (field?.hasError('email')) {
      return '請輸入有效的 Email 格式';
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      return `${
        fieldName === 'name' ? '姓名' : '密碼'
      }至少需要 ${requiredLength} 個字元`;
    }
    if (field?.hasError('passwordMismatch')) {
      return '密碼與確認密碼不符';
    }
    return '';
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/blog']);
  }
}
