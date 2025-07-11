import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ArticleService, Article } from '../../core/article.service';
import { AuthService } from '../../core/auth.service';
import { SweetAlertService } from '../../core/sweet-alert.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  allArticles: Article[] = [];
  loading = false;
  searchControl = new FormControl('');

  // 分頁設定
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;
  totalItems = 0;

  // 為了在模板中使用 Math
  Math = Math;

  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadArticles(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.articleService
      .getArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (articles) => {
          this.allArticles = articles;
          this.totalItems = articles.length;
          // 確保重置到第一頁並應用分頁
          this.currentPage = 0;
          console.log(
            'LoadArticles - total articles:',
            this.totalItems,
            'pageSize:',
            this.pageSize
          );
          this.updatePagedArticles();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.sweetAlert.error('載入失敗', '載入文章時發生錯誤');
        },
      });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0;
        this.applySearch();
      });
  }

  private applySearch(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const currentArticles = this.articleService.getCurrentArticles();

    if (!searchTerm) {
      this.allArticles = currentArticles;
    } else {
      this.allArticles = currentArticles.filter((article: Article) =>
        article.title.toLowerCase().includes(searchTerm)
      );
    }

    this.totalItems = this.allArticles.length;
    this.updatePagedArticles();
    this.cdr.detectChanges();
  }

  private updatePagedArticles(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.articles = this.allArticles.slice(startIndex, endIndex);
    console.log(
      'UpdatePagedArticles - currentPage:',
      this.currentPage,
      'pageSize:',
      this.pageSize,
      'startIndex:',
      startIndex,
      'endIndex:',
      endIndex,
      'showing:',
      this.articles.length,
      'total:',
      this.allArticles.length
    );
  }

  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.updatePagedArticles();
    this.cdr.detectChanges();
  }

  onPageSizeChange(event: any): void {
    const newPageSize = parseInt(event.target.value);
    console.log('Page size changed to:', newPageSize);
    this.pageSize = newPageSize;
    this.currentPage = 0; // 重置到第一頁
    this.updatePagedArticles();
    this.cdr.detectChanges();
    console.log(
      'After page size change - currentPage:',
      this.currentPage,
      'articles length:',
      this.articles.length
    );
  }

  onEdit(article: Article): void {
    this.router.navigate(['/articles', article.id, 'edit']);
  }

  async onDelete(article: Article): Promise<void> {
    const result = await this.sweetAlert.deleteConfirm(article.title);
    if (result.isConfirmed && article.id) {
      this.deleteArticle(article.id, article.title);
    }
  }

  private deleteArticle(id: string, title: string): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.articleService
      .deleteArticle(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          this.loading = false;
          this.cdr.detectChanges();
          if (success) {
            this.sweetAlert.deleteSuccess(title);
            this.loadArticles();
          } else {
            this.sweetAlert.error('刪除失敗', '無法刪除指定的文章');
          }
        },
        error: (error: any) => {
          this.loading = false;
          this.cdr.detectChanges();
          this.sweetAlert.error(
            '刪除失敗',
            error.message || '刪除文章時發生錯誤'
          );
        },
      });
  }

  onNewArticle(): void {
    this.router.navigate(['/articles/new']);
  }

  onLogout(): void {
    this.sweetAlert
      .confirm('確認登出', '您確定要登出嗎？', '登出', '取消')
      .then((result) => {
        if (result.isConfirmed) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
  }

  getStatusText(status: string): string {
    return status === 'published' ? '已發布' : '草稿';
  }

  getStatusClass(status: string): string {
    return status === 'published' ? 'status-published' : 'status-draft';
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
