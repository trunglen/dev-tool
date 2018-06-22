import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JsCompressComponent } from './js-compress/js-compress.component';
import { CssCompressComponent } from './css-compress/css-compress.component';

const routes: Routes = [
  { path: 'js-compress', component: JsCompressComponent },
  { path: 'css-compress', component: CssCompressComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompressRoutingModule { }
