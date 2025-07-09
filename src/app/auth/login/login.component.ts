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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false; // 新增：控制密碼顯示/隱藏

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {
    this.loginForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // 新增：切換密碼顯示/隱藏的方法
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.sweetAlert.success('登入成功', '歡迎回來！');
            this.router.navigate(['/articles']);
          } else {
            this.sweetAlert.error('登入失敗', '請檢查您的帳號密碼');
          }
        },
        error: () => {
          this.loading = false;
          this.sweetAlert.error('登入失敗', '登入時發生錯誤，請稍後再試');
        },
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName === 'email' ? 'Email' : '密碼'}為必填欄位`;
    }
    if (field?.hasError('email')) {
      return '請輸入有效的 Email 格式';
    }
    if (field?.hasError('minlength')) {
      return '密碼至少需要 6 個字元';
    }
    return '';
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToHome(): void {
    this.router.navigate(['/blog']);
  }
}
