import { CommonModule, NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { HasRoleDirective } from './_directives/has-role.directive';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule,
     NavComponent,HomeComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Client';
  users: any;
  
  constructor(private http: HttpClient,
     private accountService: AccountService,private presence: PresenceService ){
    // this.getUsers();
    this.serCurrentUser();
  }

  serCurrentUser(){
    var response =localStorage.getItem('user')
    if(response){

      const user: User = JSON.parse(response);
      if(user){

        this.accountService.setCurrentUser(user);
        this.presence.createHubConnection(user);
      }
    }
  }
  // getUsers(){

  //   this.http.get('https://localhost:7164/api/users').subscribe(response=>{
  //     this.users= response;
  //   })
  // }

}
