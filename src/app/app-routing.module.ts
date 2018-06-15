import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsonToGoComponent } from './json-to-go/json-to-go.component';
import { JsonParserComponent } from './json-parser/json-parser.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JsCompressComponent } from './js-compress/js-compress.component';
import { JsonToTsComponent } from './json-to-ts/json-to-ts.component';
import { SassToCssComponent } from './sass-to-css/sass-to-css.component';
import { JsonValidatorComponent } from './json-validator/json-validator.component';

const routes: Routes = [
    { path: 'json-to-go', component: JsonToGoComponent },
    { path: 'json-parser', component: JsonParserComponent },
    { path: 'js-compress', component: JsCompressComponent },
    { path: 'json-to-ts', component: JsonToTsComponent },
    { path: 'sass-to-css', component: SassToCssComponent },
    { path: 'json-validator', component: JsonValidatorComponent },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
