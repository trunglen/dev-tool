import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-epoch-converter',
  templateUrl: './epoch-converter.component.html',
  styleUrls: ['./epoch-converter.component.css']
})
export class EpochConverterComponent implements OnInit {

  timeStamp = toSecond(new Date().getTime())
  timeStampConvert = toSecond(new Date().getTime())
  gmtTime = new Date(toMilisecond(this.timeStampConvert)).toLocaleString()
  localTime = new Date(toMilisecond(this.timeStampConvert)).toUTCString()
  dateConvert = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate() + 1,
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    second: new Date().getSeconds(),
  }
  timeZone = 0
  //convert date to time stamp
  localTimeStampFromDate = 0
  gmtTimeStampFromDate = 0
  localEpochTime = ''
  gmtEpochTime = ''
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

  onConvertToUnix() {
    var unixLocal = new Date(
      this.dateConvert.year,
      this.dateConvert.month - 1,
      this.dateConvert.day - 1,
      this.dateConvert.hour,
      this.dateConvert.minute,
      this.dateConvert.second,
    )
    var unixGMT = new Date(
      Date.UTC(
        this.dateConvert.year,
        this.dateConvert.month - 1,
        this.dateConvert.day - 1,
        this.dateConvert.hour,
        this.dateConvert.minute,
        this.dateConvert.second,
      )
    )
    if (this.timeZone==0) {
      this.localEpochTime =unixLocal.toTimeString()
      this.gmtEpochTime = unixLocal.toUTCString()
    } else {
      this.localEpochTime =unixGMT.toTimeString()
      this.gmtEpochTime = unixGMT.toUTCString()
    }
    this.localTimeStampFromDate = this.timeZone == 0 ? toSecond(unixLocal.getTime()) : toSecond(unixGMT.getTime())
    // this.localTimeStampFromDate = toSecond(unixLocal.getTime())
    // this.gmtTimeStampFromDate = toSecond(unixGMT.getTime())
  }
}

function toMilisecond(time: number) {
  if ((time + '').length > 10) {
    return time
  }
  return time * 1000
}

function toSecond(time: number) {
  if ((time + '').length > 10) {
    return Number.parseInt(time / 1000 + '')
  }
  return time
}