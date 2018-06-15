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


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    JsonToGoComponent,
    JsonParserComponent,
    JsCompressComponent,
    JsonToTsComponent,
    SassToCssComponent,
    JsonValidatorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxJsonViewerModule, 
    AceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
