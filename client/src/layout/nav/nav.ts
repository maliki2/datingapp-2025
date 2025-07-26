import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  //@Input({required: true}) accountService = {} as AccountService
  protected accountService = inject(AccountService);
  protected toastService = inject(ToastService);
  protected router = inject(Router);
  protected creds: any = {};
 // protected UserName = signal('') 
   login() {
    console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
       this.toastService.success('Logged in successfully',3000);
        this.creds = {}
      },
      error: error => {
        console.log(error)
        if(error.error.detail)
         this.toastService.error(error.error.detail);
        if(error.error.errors)
           this.toastService.error(error.error.title);

      }
    })
  }

  logout(){
     this.accountService.logout();
     this.router.navigateByUrl('/');
  }
}
