import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
  {
    path: 'blog',
    loadComponent: () =>
      import('./blog/blog-list/blog-list.component').then(
        (m) => m.BlogListComponent
      ),
  },
  {
    path: 'blog/:id',
    loadComponent: () =>
      import('./blog/blog-detail/blog-detail.component').then(
        (m) => m.BlogDetailComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'admin',
    redirectTo: '/articles',
    pathMatch: 'full',
  },
  {
    path: 'articles',
    loadComponent: () =>
      import('./article/article-list/article-list.component').then(
        (m) => m.ArticleListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'articles/new',
    loadComponent: () =>
      import('./article/article-form/article-form.component').then(
        (m) => m.ArticleFormComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'articles/:id/edit',
    loadComponent: () =>
      import('./article/article-form/article-form.component').then(
        (m) => m.ArticleFormComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/blog' },
];
