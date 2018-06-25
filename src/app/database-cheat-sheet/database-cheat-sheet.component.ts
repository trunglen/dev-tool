import { Component, OnInit } from '@angular/core';
import { getTerminology, terminologyNames } from './constant';

@Component({
  selector: 'app-database-cheat-sheet',
  templateUrl: './database-cheat-sheet.component.html',
  styleUrls: ['./database-cheat-sheet.component.css']
})
export class DatabaseCheatSheetComponent implements OnInit {

  terminologyNames = terminologyNames
  selectedTechnologies = []
  constructor() { }

  ngOnInit() {
    getTerminology(['sql', 'rethink'])
    
  }

  onCompare() {
  }
}
