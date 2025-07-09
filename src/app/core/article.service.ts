import {
  Injectable,
  OnDestroy,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { BehaviorSubject, Observable, of, from, Subscription } from 'rxjs';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

export interface Article {
  id?: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService implements OnDestroy {
  private articlesSubject = new BehaviorSubject<Article[]>([]);
  public articles$ = this.articlesSubject.asObservable();
  private currentUserSubscription?: Subscription;
  private userSubscription?: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private injector: Injector
  ) {
    // 監聽用戶狀態變化，載入對應的文章
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      // 取消之前的文章訂閱
      if (this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }

      if (user) {
        // 使用 runInInjectionContext 來確保正確的注入上下文
        runInInjectionContext(this.injector, () => {
          this.currentUserSubscription = this.firestore
            .collection('articles', (ref) =>
              ref.where('authorId', '==', user.email)
            )
            .valueChanges({ idField: 'id' })
            .subscribe({
              next: (articles: any[]) => {
                const convertedArticles = articles.map((article) => ({
                  ...article,
                  createdAt: article.createdAt?.toDate() || new Date(),
                  updatedAt: article.updatedAt?.toDate() || new Date(),
                })) as Article[];

                // 手動排序，避免 Firestore 複合索引問題
                convertedArticles.sort(
                  (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
                );

                this.articlesSubject.next(convertedArticles);
              },
              error: (error) => {
                console.error('載入文章失敗:', error);
                this.articlesSubject.next([]);
              },
            });
        });
      } else {
        this.articlesSubject.next([]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getArticles(): Observable<Article[]> {
    return this.articles$;
  }

  getCurrentArticles(): Article[] {
    return this.articlesSubject.value;
  }

  // 新增：獲取所有已發布的文章（用於前台）
  getPublishedArticles(): Observable<Article[]> {
    return new Observable<Article[]>((observer) => {
      runInInjectionContext(this.injector, () => {
        this.firestore
          .collection('articles', (ref) =>
            ref.where('status', '==', 'published').orderBy('createdAt', 'desc')
          )
          .valueChanges({ idField: 'id' })
          .subscribe({
            next: (articles: any[]) => {
              const convertedArticles = articles.map((article) => ({
                ...article,
                createdAt: article.createdAt?.toDate() || new Date(),
                updatedAt: article.updatedAt?.toDate() || new Date(),
              })) as Article[];

              observer.next(convertedArticles);
            },
            error: (error) => {
              console.error('載入已發布文章失敗:', error);
              observer.next([]);
            },
          });
      });
    });
  }

  // 新增：根據ID獲取已發布的文章（用於前台詳細頁面）
  getPublishedArticleById(id: string): Observable<Article | null> {
    return new Observable<Article | null>((observer) => {
      runInInjectionContext(this.injector, () => {
        this.firestore
          .collection('articles')
          .doc(id)
          .valueChanges({ idField: 'id' })
          .pipe(
            map((article: any) => {
              if (article && article.status === 'published') {
                const processedArticle = {
                  ...article,
                  createdAt: article.createdAt?.toDate() || new Date(),
                  updatedAt: article.updatedAt?.toDate() || new Date(),
                } as Article;
                return processedArticle;
              }
              return null;
            }),
            catchError((error) => {
              console.error('載入已發布文章失敗:', error);
              return of(null);
            })
          )
          .subscribe({
            next: (article) => {
              observer.next(article);
              observer.complete();
            },
            error: (error) => {
              console.error('Observable 錯誤:', error);
              observer.error(error);
            },
          });
      });
    });
  }

  getArticleById(id: string): Observable<Article | null> {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          console.warn('用戶未登入，無法載入文章');
          return of(null);
        }

        console.log('開始載入文章:', { id, userEmail: user.email });

        return new Observable<Article | null>((observer) => {
          runInInjectionContext(this.injector, () => {
            this.firestore
              .collection('articles')
              .doc(id)
              .valueChanges({ idField: 'id' })
              .pipe(
                map((article: any) => {
                  console.log('Firestore 返回的文章資料:', article);
                  if (article && article.authorId === user.email) {
                    const processedArticle = {
                      ...article,
                      createdAt: article.createdAt?.toDate() || new Date(),
                      updatedAt: article.updatedAt?.toDate() || new Date(),
                    } as Article;
                    console.log('處理後的文章資料:', processedArticle);
                    return processedArticle;
                  }
                  console.warn('文章不存在或無權限存取:', {
                    id,
                    userEmail: user.email,
                    articleAuthorId: article?.authorId,
                    articleExists: !!article,
                  });
                  return null;
                }),
                catchError((error) => {
                  console.error('載入文章失敗:', error);
                  return of(null);
                })
              )
              .subscribe({
                next: (article) => {
                  observer.next(article);
                  observer.complete();
                },
                error: (error) => {
                  console.error('Observable 錯誤:', error);
                  observer.error(error);
                },
              });
          });
        });
      })
    );
  }

  createArticle(
    article: Omit<
      Article,
      'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'author'
    >
  ): Observable<Article> {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          throw new Error('用戶未登入');
        }

        const newArticle = {
          ...article,
          author: user.name,
          authorId: user.email,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return new Observable<Article>((observer) => {
          runInInjectionContext(this.injector, () => {
            this.firestore
              .collection('articles')
              .add(newArticle)
              .then((docRef) => {
                const articleWithId = {
                  ...newArticle,
                  id: docRef.id,
                } as Article;
                observer.next(articleWithId);
                observer.complete();
              })
              .catch((error) => {
                console.error('創建文章失敗:', error);
                observer.error(error);
              });
          });
        });
      })
    );
  }

  updateArticle(
    id: string,
    updates: Partial<Article>
  ): Observable<Article | null> {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          throw new Error('用戶未登入');
        }

        const updateData = {
          ...updates,
          updatedAt: new Date(),
        };

        return new Observable<Article | null>((observer) => {
          runInInjectionContext(this.injector, () => {
            this.firestore
              .collection('articles')
              .doc(id)
              .update(updateData)
              .then(() => {
                this.getArticleById(id).subscribe({
                  next: (article) => {
                    observer.next(article);
                    observer.complete();
                  },
                  error: (error) => {
                    observer.error(error);
                  },
                });
              })
              .catch((error) => {
                console.error('更新文章失敗:', error);
                observer.error(error);
              });
          });
        });
      })
    );
  }

  deleteArticle(id: string): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          throw new Error('用戶未登入');
        }

        return new Observable<boolean>((observer) => {
          runInInjectionContext(this.injector, () => {
            this.firestore
              .collection('articles')
              .doc(id)
              .delete()
              .then(() => {
                observer.next(true);
                observer.complete();
              })
              .catch((error) => {
                console.error('刪除文章失敗:', error);
                observer.next(false);
                observer.complete();
              });
          });
        });
      })
    );
  }

  searchArticles(query: string): Observable<Article[]> {
    return this.articles$.pipe(
      map((articles) =>
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }
}
