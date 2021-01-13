import { Component, OnInit, OnDestroy } from '@angular/core';
import {PostsService} from '../posts.service';
import { Post} from '../post.model';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

 posts: Post[]=[];
 private postSub : Subscription;
 isLoading=false;

 


  constructor( private postsService: PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();

    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((posts : Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId)
  }
  
  ngOnDestroy(){
    this.postSub.unsubscribe()
  }

  

}
