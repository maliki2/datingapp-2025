import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit  {
  
  private http = inject(HttpClient);
  protected  title = signal<string>('Dating app');
  protected  members = signal<any>([])

  async ngOnInit() {
    //this.http.get('https://localhost:5001/api/members').subscribe({
      //next: response => this.members.set(response),
      //error: error => console.log(error),
      //complete: () => console.log('COMPLETED THE REQUEST')
    //})

     this.members.set(await this.getMembers())
  }

  async getMembers(){
    try {
      return lastValueFrom(this.http.get('https://localhost:5001/api/members'))
    } catch (error) {
      console.log(error)
      throw error
    }
  }
 // constructor(private http: HttpClient){}
}
