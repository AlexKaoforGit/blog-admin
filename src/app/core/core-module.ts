import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // 只在非 CI 環境中初始化 Firebase
    ...((environment as any).isCI
      ? []
      : [AngularFireModule.initializeApp(environment.firebase)]),
  ],
})
export class CoreModule {}
