import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';
import { of } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.baseUrl;
 //Replaysubject store the value and anytime subscriber subscribe the observable it will emit last value stored
  private currentUserSource = new ReplaySubject<User| null>(1)

  //as this is observable by convention it uses dollar sign
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,
    private presence: PresenceService,private toastr:ToastrService
  ) { }

  login(model:any){
    return this.http.post<User>(this.baseUrl+ 'account/login', model).pipe(
      map((response:User)=>{
        const user = response;
        if(user){
          this.setCurrentUser(user)
          this.presence.createHubConnection(user);
          // localStorage.setItem('user',JSON.stringify(user));
          // this.currentUserSource.next(user);
        }
      }),
    )
  }

  register(model:any){
    return this.http.post(this.baseUrl +'account/register', model).pipe(
      map((user:any)=>{
        if(user){
        //   localStorage.setItem('user',JSON.stringify(user));
        //   this.currentUserSource.next(user);
        this.setCurrentUser(user);
        // this.presence.createHubConnection(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user:User){
    user.roles=[];
    const roles =this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles=roles: user.roles.push(roles);
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    // this.presence.stopHubConnection();
  }

  getDecodedToken(token){
    //atob decode the information inside token
    return JSON.parse(atob(token.split('.')[1]));
  }
}
