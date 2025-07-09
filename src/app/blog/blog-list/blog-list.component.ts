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

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  allArticles: Article[] = [];
  loading = false;
  searchControl = new FormControl('');

  // 分頁設定
  pageSize = 6; // 前台使用較少的每頁項目數
  currentPage = 0;
  totalItems = 0;

  // 為了在模板中使用 Math
  Math = Math;

  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPublishedArticles();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPublishedArticles(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.articleService
      .getPublishedArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (articles) => {
          this.allArticles = articles;
          this.totalItems = articles.length;
          this.updatePagedArticles();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
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

    if (!searchTerm) {
      this.articleService
        .getPublishedArticles()
        .pipe(takeUntil(this.destroy$))
        .subscribe((articles) => {
          this.allArticles = articles;
          this.totalItems = articles.length;
          this.updatePagedArticles();
          this.cdr.detectChanges();
        });
    } else {
      this.articleService
        .getPublishedArticles()
        .pipe(takeUntil(this.destroy$))
        .subscribe((articles) => {
          this.allArticles = articles.filter(
            (article: Article) =>
              article.title.toLowerCase().includes(searchTerm) ||
              article.content.toLowerCase().includes(searchTerm)
          );
          this.totalItems = this.allArticles.length;
          this.updatePagedArticles();
          this.cdr.detectChanges();
        });
    }
  }

  private updatePagedArticles(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.articles = this.allArticles.slice(startIndex, endIndex);
  }

  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.updatePagedArticles();
    this.cdr.detectChanges();

    // 滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onReadMore(article: Article): void {
    this.router.navigate(['/blog', article.id]);
  }

  goToAdmin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/blog']);
  }

  getExcerpt(content: string, maxLength: number = 120): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength).trim() + '...';
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return '';

    let date: Date;
    if (timestamp.toDate) {
      // Firestore Timestamp
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return '';
    }

    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
