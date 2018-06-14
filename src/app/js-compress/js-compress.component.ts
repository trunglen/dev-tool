import { Component, OnInit } from '@angular/core';
import * as compressjs from 'compressjs';

@Component({
  selector: 'app-js-compress',
  templateUrl: './js-compress.component.html',
  styleUrls: ['./js-compress.component.css']
})
export class JsCompressComponent implements OnInit {

  jsInput = ''
  jsOutput = ''
  constructor() { }

  ngOnInit() {
  }

  onCompress() {
    var algorithm = compressjs.Lzp3;
    var data = new Buffer(this.jsInput, 'utf8');
    var compressed = algorithm.compressFile(data);
    var decompressed = algorithm.decompressFile(compressed);
    // convert from array back to string
    this.jsOutput = new Buffer(decompressed).toString('utf8');
    console.log(this.jsOutput);
  }
}
