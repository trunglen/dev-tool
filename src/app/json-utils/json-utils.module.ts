import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JsonUtilsRoutingModule } from './json-utils-routing.module';
import { JsonHolderComponent } from './json-holder/json-holder.component';
import { JsonParserComponent } from './json-parser/json-parser.component';
import { JsonToGoComponent } from './json-to-go/json-to-go.component';
import { JsonValidatorComponent } from './json-validator/json-validator.component';
import { JsonToTsComponent } from './json-to-ts/json-to-ts.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  imports: [
    CommonModule,
    JsonUtilsRoutingModule,
    NgxJsonViewerModule, 
    AceEditorModule
  ],
  declarations: [
    JsonHolderComponent,
    JsonParserComponent,
    JsonToGoComponent,
    JsonValidatorComponent,
    JsonToTsComponent
  ]
})
export class JsonUtilsModule { }
