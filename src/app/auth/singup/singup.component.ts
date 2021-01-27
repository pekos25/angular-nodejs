import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService} from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit , OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
   this.authStatusSub= this.authService.getAuthserviceListener()
   .subscribe(authStatus => {
     this.isLoading = false;
   })
  }


  onSingup(form :NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password)
   
  }

 ngOnDestroy(){
   this.authStatusSub.unsubscribe();
 }
}

