import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-holder',
  templateUrl: './json-holder.component.html',
  styleUrls: ['./json-holder.component.css']
})
export class JsonHolderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showPostRes = false
  showUserRes = false
  userBody = { "user_name": "trunglv", "full_name": "trung luu" }
  postBody = { "title": "hello every body", "content": "Opencoder.org - small dev tool for developer", "author": "trunglv" }
  successReponse = { "status": "success" }
  errorExistUserReponse = { "error": "author exists" }
  errorNotExistUserReponse = { "error": "author not exists" }
}
