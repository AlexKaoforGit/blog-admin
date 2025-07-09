import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor() {}

  // 成功訊息
  success(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  }

  // 錯誤訊息
  error(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: '確定',
      confirmButtonColor: '#d33',
    });
  }

  // 警告訊息
  warning(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: '確定',
      confirmButtonColor: '#f39c12',
    });
  }

  // 資訊訊息
  info(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonText: '確定',
      confirmButtonColor: '#17a2b8',
    });
  }

  // 確認對話框
  confirm(
    title: string,
    message?: string,
    confirmText = '確定',
    cancelText = '取消'
  ): Promise<any> {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
    });
  }

  // 刪除確認對話框
  deleteConfirm(itemName: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: '確認刪除',
      text: `確定要刪除「${itemName}」嗎？此操作無法復原。`,
      showCancelButton: true,
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
    });
  }

  // 刪除成功訊息
  deleteSuccess(itemName?: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: '刪除成功',
      text: itemName ? `「${itemName}」已成功刪除` : '項目已成功刪除',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  }

  // 載入中
  showLoading(title = '處理中...'): void {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // 關閉載入中
  closeLoading(): void {
    Swal.close();
  }

  // 自訂對話框
  custom(options: any): Promise<any> {
    return Swal.fire(options);
  }
}
