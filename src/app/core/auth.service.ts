import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export interface User {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private afAuth: AngularFireAuth) {
    this.loadUserFromStorage();
    this.afAuth.authState.subscribe((firebaseUser: firebase.User | null) => {
      console.log('Firebase authState 變化:', firebaseUser?.email || 'null');
      if (firebaseUser) {
        const user: User = {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        console.log('設置當前用戶:', user);
      } else {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        console.log('清除當前用戶');
      }
    });
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable((observer) => {
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          // 等待 authState 確實更新後再回傳成功
          const subscription = this.afAuth.authState.subscribe((user) => {
            if (user) {
              subscription.unsubscribe();
              observer.next(true);
              observer.complete();
            }
          });
        })
        .catch((error) => {
          console.error('Login error:', error);
          observer.next(false);
          observer.complete();
        });
    });
  }

  register(
    email: string,
    password: string,
    displayName?: string
  ): Observable<boolean> {
    return new Observable((observer) => {
      this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // 如果提供了顯示名稱，更新用戶資料
          if (displayName && userCredential.user) {
            return userCredential.user.updateProfile({
              displayName: displayName,
            });
          }
          return Promise.resolve();
        })
        .then(() => {
          // 等待 authState 確實更新後再回傳成功
          const subscription = this.afAuth.authState.subscribe((user) => {
            if (user) {
              subscription.unsubscribe();
              observer.next(true);
              observer.complete();
            }
          });
        })
        .catch((error) => {
          console.error('Registration error:', error);
          observer.next(false);
          observer.complete();
        });
    });
  }

  logout(): void {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
    });
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
