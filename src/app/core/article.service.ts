import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articlesSubject = new BehaviorSubject<Article[]>(this.getInitialArticles());
  public articles$ = this.articlesSubject.asObservable();

  constructor() {}

  private getInitialArticles(): Article[] {
    const stored = localStorage.getItem('articles');
    if (stored) {
      const articles = JSON.parse(stored);
      return articles.map((article: any) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt)
      }));
    }

    // 預設資料
    return [
      {
        id: 1,
        title: 'Angular 開發最佳實踐',
        content: '這是一篇關於 Angular 開發最佳實踐的文章...',
        author: '管理員',
        tags: ['Angular', '前端開發'],
        status: 'published',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'TypeScript 進階技巧',
        content: 'TypeScript 提供了許多強大的功能...',
        author: '管理員',
        tags: ['TypeScript', '程式設計'],
        status: 'draft',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12')
      }
    ];
  }

  private saveToStorage(articles: Article[]): void {
    localStorage.setItem('articles', JSON.stringify(articles));
  }

  getArticles(): Observable<Article[]> {
    return this.articles$.pipe(delay(300)); // 模擬 API 延遲
  }

  getCurrentArticles(): Article[] {
    return this.articlesSubject.value;
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return this.articles$.pipe(
      map(articles => articles.find(article => article.id === id)),
      delay(200)
    );
  }

  createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Observable<Article> {
    return new Observable(observer => {
      const newArticle: Article = {
        ...article,
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const currentArticles = this.articlesSubject.value;
      const updatedArticles = [...currentArticles, newArticle];
      
      this.articlesSubject.next(updatedArticles);
      this.saveToStorage(updatedArticles);
      
      observer.next(newArticle);
      observer.complete();
    });
  }

  updateArticle(id: number, updates: Partial<Article>): Observable<Article | null> {
    return new Observable(observer => {
      const currentArticles = this.articlesSubject.value;
      const articleIndex = currentArticles.findIndex(article => article.id === id);
      
      if (articleIndex === -1) {
        observer.next(null);
        observer.complete();
        return;
      }

      const updatedArticle: Article = {
        ...currentArticles[articleIndex],
        ...updates,
        updatedAt: new Date()
      };

      const updatedArticles = [...currentArticles];
      updatedArticles[articleIndex] = updatedArticle;
      
      this.articlesSubject.next(updatedArticles);
      this.saveToStorage(updatedArticles);
      
      observer.next(updatedArticle);
      observer.complete();
    });
  }

  deleteArticle(id: number): Observable<boolean> {
    return new Observable(observer => {
      const currentArticles = this.articlesSubject.value;
      const filteredArticles = currentArticles.filter(article => article.id !== id);
      
      if (filteredArticles.length === currentArticles.length) {
        observer.next(false);
      } else {
        this.articlesSubject.next(filteredArticles);
        this.saveToStorage(filteredArticles);
        observer.next(true);
      }
      
      observer.complete();
    });
  }

  searchArticles(query: string): Observable<Article[]> {
    return this.articles$.pipe(
      map(articles => 
        articles.filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase())
        )
      ),
      delay(200)
    );
  }
} 