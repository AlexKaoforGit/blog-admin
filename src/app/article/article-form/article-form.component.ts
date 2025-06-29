import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ArticleService, Article } from '../../core/article.service';
import { AuthService } from '../../core/auth.service';
import { SweetAlertService } from '../../core/sweet-alert.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleFormComponent implements OnInit, OnDestroy {
  articleForm: FormGroup;
  loading = false;
  isEditMode = false;
  articleId: number | null = null;
  
  availableTags = ['Angular', 'TypeScript', '前端開發', '程式設計', 'Web開發', 'JavaScript', 'CSS', 'HTML'];
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sweetAlert: SweetAlertService
  ) {
    this.articleForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.articleId = +params['id'];
        this.loadArticle(this.articleId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      tags: this.fb.array([]),
      status: ['draft', Validators.required]
    });
  }

  private loadArticle(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.articleService.getArticleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article) => {
          if (article) {
            this.populateForm(article);
          } else {
            this.sweetAlert.error('找不到文章', '找不到指定的文章');
            this.router.navigate(['/articles']);
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.sweetAlert.error('載入失敗', '載入文章時發生錯誤');
          this.router.navigate(['/articles']);
        }
      });
  }

  private populateForm(article: Article): void {
    this.articleForm.patchValue({
      title: article.title,
      content: article.content,
      status: article.status
    });

    // 設定標籤
    const tagsArray = this.articleForm.get('tags') as FormArray;
    tagsArray.clear();
    article.tags.forEach(tag => {
      tagsArray.push(this.fb.control(tag));
    });
  }

  get tagsArray(): FormArray {
    return this.articleForm.get('tags') as FormArray;
  }

  addTag(tag: string): void {
    const tagsArray = this.articleForm.get('tags') as FormArray;
    if (!tagsArray.value.includes(tag)) {
      tagsArray.push(this.fb.control(tag));
      this.cdr.detectChanges();
    }
  }

  removeTag(index: number): void {
    const tagsArray = this.articleForm.get('tags') as FormArray;
    tagsArray.removeAt(index);
    this.cdr.detectChanges();
  }

  addCustomTag(event: Event): void {
    event.preventDefault(); // 防止表單提交
    
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    
    if (value && !this.tagsArray.value.includes(value)) {
      this.tagsArray.push(this.fb.control(value));
      this.cdr.detectChanges();
    }
    
    target.value = '';
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      this.loading = true;
      this.cdr.detectChanges();
      
      const formValue = this.articleForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      const articleData = {
        title: formValue.title,
        content: formValue.content,
        author: currentUser?.name || '管理員',
        tags: formValue.tags,
        status: formValue.status
      };

      if (this.isEditMode && this.articleId) {
        this.articleService.updateArticle(this.articleId, articleData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (updatedArticle) => {
              this.loading = false;
              this.cdr.detectChanges();
              if (updatedArticle) {
                this.sweetAlert.success('更新成功', '文章已成功更新');
                this.router.navigate(['/articles']);
              } else {
                this.sweetAlert.error('更新失敗', '更新文章失敗');
              }
            },
            error: () => {
              this.loading = false;
              this.cdr.detectChanges();
              this.sweetAlert.error('更新失敗', '更新文章時發生錯誤');
            }
          });
      } else {
        this.articleService.createArticle(articleData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              this.cdr.detectChanges();
              this.sweetAlert.success('建立成功', '文章已成功建立');
              this.router.navigate(['/articles']);
            },
            error: () => {
              this.loading = false;
              this.cdr.detectChanges();
              this.sweetAlert.error('建立失敗', '建立文章時發生錯誤');
            }
          });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/articles']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.articleForm.get(fieldName);
    if (field?.hasError('required')) {
      return '此欄位為必填';
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      return `最少需要 ${requiredLength} 個字元`;
    }
    return '';
  }
} 