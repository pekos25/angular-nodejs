import { Component, OnInit, OnDestroy } from '@angular/core';
import {PostsService} from '../posts.service';
import { Post} from '../post.model';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

 posts: Post[]=[];
 private postSub : Subscription;
 isLoading=false;
 totalPosts=0;
 postsPerPage=2;
 currentPage=1;
 pageSizeOptions=[1,2,5,10];
 userId: string;
 private authServiceSubs : Subscription; 
 userIsAuthenticated = false;


 


  constructor( private postsService: PostsService , private authservice : AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, 1);
    this.userId = this.authservice.getUserId();

    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((postData : {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts= postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authservice.getIsAuth();
    this.authServiceSubs = this.authservice.getAuthserviceListener()
    .subscribe(isAutheticated =>{
      this.userIsAuthenticated = isAutheticated;
      this.userId = this.authservice.getUserId();

    })
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId)
    .subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.postsService.val.next(this.posts.length)
    })
  }

  onChangePage(pageData : PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  
  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authServiceSubs.unsubscribe();
  }

  

  

}
