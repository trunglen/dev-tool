import { Component, OnInit } from '@angular/core';
import { jsonToGo } from '../shared/x/json_to_go';

@Component({
  selector: 'app-json-to-go',
  templateUrl: './json-to-go.component.html',
  styleUrls: ['./json-to-go.component.css']
})
export class JsonToGoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  data: string = ''
  code:string = ''
  // get code() {
  //   return JSON.stringify(this.data, null, 2);
  // }

  // set code(v) {
  //   console.log(jsonToGo(v));
  //   try {
  //     this.data = <any>jsonToGo(v).go;
  //   }
  //   catch (e) {
  //     console.log('error occored while you were typing the JSON');
  //   };
  // }
  onConvert() {
    this.data = <any>jsonToGo(this.code).go;
    console.log(this.data)
  }
}
