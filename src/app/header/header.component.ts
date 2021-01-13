import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  val: Number ;
  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
     this.postsService.getVal().subscribe(v => this.val = v)
  }

}
