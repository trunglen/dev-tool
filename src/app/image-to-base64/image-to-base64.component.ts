import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image-to-base64',
  templateUrl: './image-to-base64.component.html',
  styleUrls: ['./image-to-base64.component.css']
})
export class ImageToBase64Component implements OnInit {

  ngAfterViewChecked(): void {
    console.log('after view init')
  }
  imageUploaded: string = 'assets/images/no-image.png'
  showResult = false
  isLoading = false
  @ViewChild('outputImg') outputImg:ElementRef
  @ViewChild('outputCSS') outputCSS:ElementRef
  constructor() { }

  ngOnInit() {
  }

  previewFile() {
    this.showResult = true
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 3000);
    var self = this
    var preview = <HTMLImageElement>document.querySelector('.load-image');
    var file = (<HTMLInputElement>document.querySelector('input[type=file]')).files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      const value = reader.result
      preview.src = value;
      // document.querySelector('.base64-output-css').textContent = `url('${value}')`
      self.outputImg.nativeElement.value = value
      self.outputCSS.nativeElement.value = `url('${value}')`
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }

}

