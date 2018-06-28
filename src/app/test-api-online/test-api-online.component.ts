import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-test-api-online',
  templateUrl: './test-api-online.component.html',
  styleUrls: ['./test-api-online.component.css'],
  providers: [HttpClient]
})
export class TestApiOnlineComponent implements OnInit {
  method = 'GET'
  errMsg = ''
  isInProgress = false
  responseTime = 0
  numberOfRequest = 1
  numberOfFinish = 0
  numberOfSuccess = 0
  numberOfError = 0
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    const start = new Date().getTime()
    this.http.get('http://dantri.com.vn/').subscribe(res=>{
      console.log(res);
      const timing = new Date().getTime()-start;
    })
  }

  initComponent() {
    this.errMsg = ''
    this.responseTime = 0
    this.numberOfFinish = 0
    this.numberOfSuccess = 0
    this.numberOfError = 0
  }
  
  onTestRestApi(f: NgForm) {
    const value = f.value
    this.initComponent()    
    this.validateForm(value)
    if (!this.errMsg) {
      const header = new HttpHeaders()
      if (value.authentication) {
        header.set('Authorization', value.token)
      }
      if (this.method === 'GET') {
        this.isInProgress = true
        const startRequestTime = new Date().getTime()
        let endRequestTime = startRequestTime
        for (let i = 0; i < this.numberOfRequest; i++) {
          this.http.get(value.requestUrl).subscribe(res => {
            this.numberOfSuccess++
          }, err => {
            this.numberOfError++
          }, () => {
            this.numberOfFinish++
            if (this.numberOfFinish == this.numberOfRequest) {
              this.isInProgress = false
              endRequestTime = new Date().getTime()
              this.responseTime = endRequestTime - startRequestTime
            }
          })
        }
      } else {
        this.http.post(value.requestUrl, {}).subscribe(res => {
          console.log(res)
        }, err => {
          console.log(err)
        }, () => {
          this.isInProgress = false
        })
      }
    }
  }

  validateForm(value: any) {
    if (!value.requestUrl) {
      this.errMsg = 'Request Url must be filled'
    }
    if (value.authentication && !value.token) {
      this.errMsg = 'Your token must be filled if select authentication mode'
    }
    if (value.body) {
      try {
        JSON.parse(value.body)
      } catch (error) {
        this.errMsg = 'Your body is invalid JSON'
      }
    }
  }
}

