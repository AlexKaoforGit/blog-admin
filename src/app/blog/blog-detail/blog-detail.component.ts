import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ArticleService, Article } from '../../core/article.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  article: Article | null = null;
  loading = false;
  notFound = false;

  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const articleId = params['id'];
      if (articleId) {
        this.loadArticle(articleId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadArticle(id: string): void {
    this.loading = true;
    this.notFound = false;
    this.cdr.detectChanges();

    this.articleService
      .getPublishedArticleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article) => {
          this.loading = false;
          if (article) {
            this.article = article;
          } else {
            this.notFound = true;
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.notFound = true;
          this.cdr.detectChanges();
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }

  goToAdmin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/blog']);
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
      weekday: 'long',
    });
  }

  formatContent(content: string): string {
    // 簡單的換行處理
    return content.replace(/\n/g, '<br>');
  }
}
