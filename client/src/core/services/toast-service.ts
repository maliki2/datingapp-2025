import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private ToastContainerID: string = 'toast-container'
  constructor() {
    this.createToastContainer();
  }

  private createToastContainer() {
    if (!document.getElementById(this.ToastContainerID)) {
      const container = document.createElement('div');
      container.id = this.ToastContainerID;
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container);
    }
  }
  private createToastElement(
    message: string,
    alertClass: string,
    duration = 5000
  ) {
     
    const toastContainer = document.getElementById(this.ToastContainerID);
    if(!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass,'shadow-lg');
    toast.innerHTML = `
     <span>${message}</span>
     <button class="ml-4 btn btn-sm btn-ghost">X</button>
    `;
    toast.querySelector('button')?.addEventListener('click', () => {
        toastContainer.removeChild(toast);
    });

     toastContainer.appendChild(toast);
     
     setTimeout(()=>{
         if(toastContainer.contains(toast)){
          toastContainer.removeChild(toast);
         }
     }, duration);
  }

  success(message: string, duration?: number){
    this.createToastElement(message,'alert-success',duration);
  }
  error(message: string, duration?: number){
    this.createToastElement(message,'alert-error',duration);
  }
  warnig(message: string, duration?: number){
    this.createToastElement(message,'alert-warning',duration);
  }
  info(message: string, duration?: number){
    this.createToastElement(message,'alert-info',duration);
  }
  removeExitingToastAlert(){

  }
}
