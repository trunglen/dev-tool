import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AceEditorModule } from 'ng2-ace-editor';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { SassToCssComponent } from './sass-to-css/sass-to-css.component';
import { TestApiOnlineComponent } from './test-api-online/test-api-online.component';
import { CoreModule } from './core/core.module';
import { EpochConverterComponent } from './epoch-converter/epoch-converter.component';
import { ImageToBase64Component } from './image-to-base64/image-to-base64.component';
import { DatabaseCheatSheetComponent } from './database-cheat-sheet/database-cheat-sheet.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SassToCssComponent,
    TestApiOnlineComponent,
    EpochConverterComponent,
    ImageToBase64Component,
    DatabaseCheatSheetComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule,
    AppRoutingModule,
    NgxJsonViewerModule, 
    AceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
