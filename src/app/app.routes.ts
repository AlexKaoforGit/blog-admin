import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { 
    path: 'articles', 
    loadComponent: () => import('./article/article-list/article-list.component').then(m => m.ArticleListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'articles/new', 
    loadComponent: () => import('./article/article-form/article-form.component').then(m => m.ArticleFormComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'articles/:id/edit', 
    loadComponent: () => import('./article/article-form/article-form.component').then(m => m.ArticleFormComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/articles' }
];
