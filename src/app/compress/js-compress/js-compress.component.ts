import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-js-compress',
  templateUrl: './js-compress.component.html',
  styleUrls: ['./js-compress.component.css']
})
export class JsCompressComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  onCompress(js: HTMLInputElement) {
    const formData = new FormData()
    formData.append('source', js.value)
    formData.append('type', 'js')
    this.http.post('https://minify.minifier.org/', formData).subscribe((res: any) => {
      js.value = (res.minified)
    })
  }
}
