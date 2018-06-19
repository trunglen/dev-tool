import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-epoch-converter',
  templateUrl: './epoch-converter.component.html',
  styleUrls: ['./epoch-converter.component.css']
})
export class EpochConverterComponent implements OnInit {

  timeStamp = Number.parseInt(new Date().getTime() / 1000 + '')
  timeStampConvert = Number.parseInt(new Date().getTime() / 1000 + '')
  gmtTime = new Date(toMilisecond(this.timeStampConvert)).toLocaleString()
  localTime = new Date(toMilisecond(this.timeStampConvert)).toUTCString()
  constructor() { }

  ngOnInit() {
    setInterval(() => {
      this.timeStamp++
    }, 1000)
  }

  onConvertToDate() {
    this.localTime = new Date(toMilisecond(this.timeStampConvert)).toLocaleString()
    this.gmtTime = new Date(toMilisecond(this.timeStampConvert)).toUTCString()
  }
}

function toMilisecond(time: number) {
  if ((time + '').length > 10) {
    return time
  }
  return time*1000
}