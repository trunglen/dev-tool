import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AceEditorModule } from 'ng2-ace-editor';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JsonToGoComponent } from './json-to-go/json-to-go.component';
import { JsonParserComponent } from './json-parser/json-parser.component';
import { AppRoutingModule } from './app-routing.module';
import { JsCompressComponent } from './js-compress/js-compress.component';
import { FormsModule } from '@angular/forms';
import { JsonToTsComponent } from './json-to-ts/json-to-ts.component';
import { SassToCssComponent } from './sass-to-css/sass-to-css.component';
import { JsonValidatorComponent } from './json-validator/json-validator.component';
import { TestApiOnlineComponent } from './test-api-online/test-api-online.component';
import { JsonHolderComponent } from './json-holder/json-holder.component';
import { CoreModule } from './core/core.module';
import { EpochConverterComponent } from './epoch-converter/epoch-converter.component';
import { ImageToBase64Component } from './image-to-base64/image-to-base64.component';
import { DatabaseCheatSheetComponent } from './database-cheat-sheet/database-cheat-sheet.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    JsonToGoComponent,
    JsonParserComponent,
    JsCompressComponent,
    JsonToTsComponent,
    SassToCssComponent,
    JsonValidatorComponent,
    TestApiOnlineComponent,
    JsonHolderComponent,
    EpochConverterComponent,
    ImageToBase64Component,
    DatabaseCheatSheetComponent
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
