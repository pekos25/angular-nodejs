import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts/posts.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy{
  val: Number ;
  private authListenerSubs: Subscription;
  userIsAuthenticated =false;

  constructor(private postsService: PostsService , private authService : AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth()
   this.authListenerSubs = this.authService.getAuthserviceListener()
   .subscribe(isAuthenticated => {
     this.userIsAuthenticated = isAuthenticated
   })
     this.postsService.getVal().subscribe(v => this.val = v)
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }



  

}
