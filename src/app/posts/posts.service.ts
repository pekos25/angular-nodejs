import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from './post.model';
import { Router } from '@angular/router';
import {Subject } from 'rxjs';
import { map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  // posts: Post[] = [{title: 'First Title ' , content : 'First content'},
  // {title: 'Second Title ' , content : 'Second content'},
  // {title: 'Third Title ' , content : 'Third content'}]

  private posts: Post[]=[];
  private postsUpdated = new Subject<Post[]>()
  private val = new Subject<Number>();
  constructor(private http : HttpClient, private router : Router) { 
    
  }

  getPosts(){
    this.http.get<{message: string , posts : any}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
    return postData.posts.map(post =>  {
      return { title: post.title,
               content: post.content,
               id: post._id}
             })
    }))
    .subscribe(transformedPost => {
   this.posts = transformedPost;
   this.postsUpdated.next([...this.posts]);
   this.val.next(this.posts.length)
    } )
  }

  getVal(){
    return this.val.asObservable();
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
     return this.http.get<{ _id: string; title: string; content: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, content: string){
    const post : Post = {id: null, title: title, content: content} ;
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts',post)
    .subscribe((responseData)=>{
       const id= responseData.postId;
       post.id = id;
       this.posts.push(post);
       this.postsUpdated.next([...this.posts]);
       this.router.navigate(["/"]);
       this.val.next(this.posts.length)
    })
    
  }

  updatePost(id: string, title: string, content: string){
    const post : Post = {id: id, title: title, content: content} ;
    this.http.put('http://127.0.0.1:3000/api/posts/'+ id, post)
    .subscribe(response => {
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
      updatedPost[oldPostIndex]= post;
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string){
    this.http.delete('http://127.0.0.1:3000/api/posts/' + postId)
    .subscribe(()=>{
     const updatedPost = this.posts.filter(post=> post.id != postId);
     this.posts = updatedPost;
     this.postsUpdated.next([...this.posts]);
     this.val.next(this.posts.length)
    })
  }
}
