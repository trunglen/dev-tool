import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-validator',
  templateUrl: './json-validator.component.html',
  styleUrls: ['./json-validator.component.css']
})
export class JsonValidatorComponent implements OnInit {

  isValid = false
  constructor() { }

  ngOnInit() {
  }

  onValidate(json:HTMLInputElement) {
    try {
      JSON.parse(json.value)
      this.isValid = true
    } catch (error) {
      console.log(error)
      this.isValid = false
    }
  }
}
