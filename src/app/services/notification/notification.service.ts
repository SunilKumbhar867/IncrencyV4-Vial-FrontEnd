import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toastInfoRef;
  toastErrorRef;
  toastSuccessRef;
  constructor(private toastr: ToastrService) {
  }

//*********************************************************************************** */
  showSuccessWithTimeout(message, title) {
    this.toastSuccessRef = this.toastr.success(message, title, {
      disableTimeOut: true,
      tapToDismiss: false
    })
  }
  hideSuccessToast() {

    if (typeof (this.toastSuccessRef) == 'object') {
      this.toastr.clear(this.toastSuccessRef.ToastId)
    }
  }
  //*********************************************************************************** */
  showInfoWithTimeout(message, title) {
    this.toastInfoRef = this.toastr.info(message, title, {
      disableTimeOut: true,
      tapToDismiss: false,
      progressBar: false,
      progressAnimation:'increasing'
    })
  }
  hideInfoToast() {
    if (typeof (this.toastInfoRef) == 'object') {
      this.toastr.clear(this.toastInfoRef.ToastId)
    }
  }
  /************************************************************************************* */
  showErrorWithTimeout(message, title) {
    this.toastErrorRef = this.toastr.error(message, title, {
      disableTimeOut: true,
      tapToDismiss: false,
    })
  }
  hideErrorToast() {
    if (typeof (this.toastErrorRef) == 'object') {
      this.toastr.clear(this.toastErrorRef.ToastId)
    }
  }
  //*********************************************************************************** */
  /************************************************************************************* */
  showWarningWithTimeout(message, title) {
    this.toastErrorRef = this.toastr.warning(message, title, {
      disableTimeOut: true,
      tapToDismiss: false
    })
  }
  hideWarningToast() {
    if (typeof (this.toastErrorRef) == 'object') {
      this.toastr.clear(this.toastErrorRef.ToastId)
    }
  }
  //*********************************************************************************** */
}
