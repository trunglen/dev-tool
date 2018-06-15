import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sass-to-css',
  templateUrl: './sass-to-css.component.html',
  styleUrls: ['./sass-to-css.component.css']
})
export class SassToCssComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  data = ''

  get code() {
    return JSON.stringify('', null, 2);
  }

  set code(v) {
    try {
      
    }
    catch (e) {
      console.log('error occored while you were typing the JSON');
    };
  }
}
