import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsonToGoComponent } from './json-to-go/json-to-go.component';
import { JsonParserComponent } from './json-parser/json-parser.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JsCompressComponent } from './js-compress/js-compress.component';

const routes: Routes = [
    { path: 'json-to-go', component: JsonToGoComponent },
    { path: 'json-parser', component: JsonParserComponent },
    { path: 'js-compress', component: JsCompressComponent },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
