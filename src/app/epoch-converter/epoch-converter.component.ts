import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { getEndDateOfMonth } from '../common/time-utils';

@Component({
  selector: 'app-epoch-converter',
  templateUrl: './epoch-converter.component.html',
  styleUrls: ['./epoch-converter.component.css']
})
export class EpochConverterComponent implements OnInit {

  timeStamp = toSecond(new Date().getTime())
  timeStampConvert = toSecond(new Date().getTime())
  gmtTime = new Date(toMilisecond(this.timeStampConvert)).toUTCString()
  localTime = new Date(toMilisecond(this.timeStampConvert)).toLocaleString()
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
  //Epoch dates for the start and end of the year/month/day
  showStartOfTable = false
  startOf = 'day'
  @ViewChild('startOfYear') startOfYear: ElementRef
  @ViewChild('startOfDay') startOfDay: ElementRef
  @ViewChild('startOfMonth') startOfMonth: ElementRef
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

  changeStartOf(by: string) {
    this.startOf = by
    if (by === 'month') {
      this.startOfDay.nativeElement.disabled = true
      this.startOfMonth.nativeElement.disabled = false
    } else if (by === 'year') {
      this.startOfDay.nativeElement.disabled = true
      this.startOfMonth.nativeElement.disabled = true
    } else {
      this.startOfDay.nativeElement.disabled = false
      this.startOfMonth.nativeElement.disabled = false
    }
  }

  onConvertStartOf() {
    // console.log(input.disabled =true)
    const value = (el: ElementRef) => {
      return el.nativeElement.value * 1
    }
    let startEpoch = document.getElementById('startOfEpoch')
    let endEpoch = document.getElementById('endOfEpoch')
    let startTime = document.getElementById('startOfTime')
    let endTime = document.getElementById('endOfTime')
    let startDate = new Date()
    let endDate = new Date()
    const setDate = (startDate, endDate: Date) => {
      startEpoch.textContent = toSecond(startDate.getTime()) + ''
      endEpoch.textContent = toSecond(endDate.getTime()) + ''
      startTime.textContent = startDate.toString()
      endTime.textContent = endDate.toString()
    }
    if (this.startOf === 'day') {
      startDate = new Date(value(this.startOfYear), value(this.startOfMonth) - 1, value(this.startOfDay), 0, 0, 0)
      endDate = new Date(value(this.startOfYear), value(this.startOfMonth) - 1, value(this.startOfDay), 23, 59, 59)
      setDate(startDate, endDate)
    } else if (this.startOf === 'month') {
      startDate = new Date(value(this.startOfYear), value(this.startOfMonth) - 1, 1, 0, 0, 0)
      endDate = new Date(value(this.startOfYear), value(this.startOfMonth) - 1, getEndDateOfMonth(value(this.startOfMonth), value(this.startOfYear)), 23, 59, 59)
      setDate(startDate, endDate)
    } else if (this.startOf === 'year') {
      startDate = new Date(value(this.startOfYear), 0, 1, 0, 0, 0)
      endDate = new Date(value(this.startOfYear), 11, 31, 23, 59, 59)
      setDate(startDate, endDate)
    }
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
    if (this.timeZone == 0) {
      this.localEpochTime = unixLocal.toTimeString()
      this.gmtEpochTime = unixLocal.toUTCString()
    } else {
      this.localEpochTime = unixGMT.toTimeString()
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