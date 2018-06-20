import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsonToGoComponent } from './json-to-go/json-to-go.component';
import { JsonParserComponent } from './json-parser/json-parser.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JsCompressComponent } from './js-compress/js-compress.component';
import { JsonToTsComponent } from './json-to-ts/json-to-ts.component';
import { SassToCssComponent } from './sass-to-css/sass-to-css.component';
import { JsonValidatorComponent } from './json-validator/json-validator.component';
import { TestApiOnlineComponent } from './test-api-online/test-api-online.component';
import { JsonHolderComponent } from './json-holder/json-holder.component';
import { EpochConverterComponent } from './epoch-converter/epoch-converter.component';
import { ImageToBase64Component } from './image-to-base64/image-to-base64.component';
import { DatabaseCheatSheetComponent } from './database-cheat-sheet/database-cheat-sheet.component';

const routes: Routes = [
    { path: 'json-to-go', component: JsonToGoComponent },
    { path: 'json-parser', component: JsonParserComponent },
    { path: 'js-compress', component: JsCompressComponent },
    { path: 'json-to-ts', component: JsonToTsComponent },
    { path: 'sass-to-css', component: SassToCssComponent },
    { path: 'json-validator', component: JsonValidatorComponent },
    { path: 'json-holder', component: JsonHolderComponent },
    { path: 'test-api-online', component: TestApiOnlineComponent },
    { path: 'epoch-converter-online', component: EpochConverterComponent },
    { path: 'image-to-base64', component: ImageToBase64Component },
    { path: 'database-cheat-sheet', component: DatabaseCheatSheetComponent },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
