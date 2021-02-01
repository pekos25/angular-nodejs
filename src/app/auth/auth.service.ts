import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthData} from './auth-data.model'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment} from '../../environments/environment';



const BACKEND_URL = environment.apiUrl + "/user";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthtenticated = false; 
  private token: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  tokenTimer : any;

  constructor(private http : HttpClient , private router : Router) { }

  getToken(){
    return this.token
  }

  getIsAuth(){
    return this.isAuthtenticated;
  }


  getAuthserviceListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData : AuthData = {email: email , password: password};
    this.http.post(BACKEND_URL+ "/singup", authData)
    .subscribe(()=>{
      this.router.navigate(["/"]);
    }, error =>{
      this.authStatusListener.next(false);
    })
    }


  getUserId(){
    return this.userId;
  }


login(email: string, password: string){
  const authData : AuthData = {email: email , password: password};
  this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL+"/login", authData)
  .subscribe(response => {
         const token = response.token;
         this.token = token;
         if(token){
           const expiresInDuration = response.expiresIn;
           this.setAuthTimer(expiresInDuration * 1000);
           
           this.isAuthtenticated = true;
           this.userId = response.userId;
           this.authStatusListener.next(true);
           const now = new Date();
           const expirationDate= new Date(now.getTime() + expiresInDuration * 1000)
          //  console.log(expirationDate);
           this.saveAuthData(token, expirationDate, this.userId);
           this.router.navigate(['/']);
         }
         
  }, error => {
    this.authStatusListener.next(false)
  })
  
}


logout(){
  this.token= null;
  this.isAuthtenticated = false;
  this.authStatusListener.next(false);
  clearTimeout(this.tokenTimer);
  this.userId = null;
  this.clearAuthData();
  this.router.navigate(['/']);
  
}

private setAuthTimer(duration){
  this.tokenTimer =  setTimeout(()=>{
    this.logout();
  },duration)
}

autoAuthUser(){
  const authInformation = this.getAuthData();
  if(!authInformation){
    return;
  }
  const now = new Date();
  const expireIn = authInformation.expirationDate.getTime() - now.getTime();
  if(expireIn > 0){
    this.token = authInformation.token;
    this.isAuthtenticated = true;
    this.userId =authInformation.userId;
    this.setAuthTimer(expireIn / 1000)
    this.authStatusListener.next(true);
  }
}

private saveAuthData(token: string, expirationDate: Date, userId: string ){
  localStorage.setItem("token",token);
  localStorage.setItem("expiration", expirationDate.toISOString())
  localStorage.setItem("userId", userId);
}

private clearAuthData(){
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userId")
}

private getAuthData(){
  const token = localStorage.getItem("token");
  const expirationDate = localStorage.getItem("expiration");
  const userId = localStorage.getItem("userId");
  if(!token || !expirationDate ){
    return;
  }
  return {
    token : token,
    expirationDate: new Date(expirationDate),
    userId: userId
  }
}

}
