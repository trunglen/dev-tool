import { Component, OnInit } from '@angular/core';
import { sampleInput } from '../common/sample';

@Component({
  selector: 'app-json-parser',
  templateUrl: './json-parser.component.html',
  styleUrls: ['./json-parser.component.css']
})
export class JsonParserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  data = sampleInput

  get code () {
    return JSON.stringify(this.data, null, 2);
  }

  set code (v) {
    try{
      this.data = JSON.parse(v);
    }
    catch(e) {
      console.log('error occored while you were typing the JSON');
    };
  }

}
