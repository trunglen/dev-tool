import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-css-compress',
  templateUrl: './css-compress.component.html',
  styleUrls: ['./css-compress.component.css']
})
export class CssCompressComponent implements OnInit {
  isLoading = false
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  onCompress(css: HTMLInputElement) {
    const formData = new FormData()
    formData.append('source', css.value)
    formData.append('type', 'css')
    this.isLoading = true
    this.http.post('https://minify.minifier.org/', formData).subscribe((res: any) => {
      css.value = (res.minified)
      this.isLoading = false
    })
  }
}
