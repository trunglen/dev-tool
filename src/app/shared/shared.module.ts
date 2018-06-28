import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AceEditorModule } from 'ng2-ace-editor';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
  imports: [
    CommonModule,
    NgxJsonViewerModule,
    AceEditorModule,
    MonacoEditorModule
  ],
  declarations: [
    LoadingComponent
  ],
  exports: [
    LoadingComponent,
    AceEditorModule,
    NgxJsonViewerModule,
    MonacoEditorModule
  ]
})
export class SharedModule { }
