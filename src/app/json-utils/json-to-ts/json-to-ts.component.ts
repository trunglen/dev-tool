import { Component, OnInit } from '@angular/core';
import { sampleTSInput } from '../../common/sample';
declare var require: any
const JsonToTS = require('json-to-ts')

@Component({
  selector: 'app-json-to-ts',
  templateUrl: './json-to-ts.component.html',
  styleUrls: ['./json-to-ts.component.css']
})
export class JsonToTsComponent implements OnInit {
  data = ''

  get code() {
    return JSON.stringify(sampleTSInput, null, 2);
  }

  set code(v) {
    this.data = ''
    try {
      JsonToTS(JSON.parse(v)).forEach(typeInterface => {
        this.data += typeInterface + '\n\n'
      })
      console.log(this.data)
    }
    catch (e) {
      console.log('error occored while you were typing the JSON');
    };
  }

  constructor() { }

  ngOnInit() {
    this.code = JSON.stringify(sampleTSInput, null, 2);
    // this.output = JsonToTS(this.input)
  }
  editorOptions = { theme: 'vs-dark', language: 'json' };
  editorOptionsOutput = { theme: 'vs-dark', language: 'typescript' };
}

