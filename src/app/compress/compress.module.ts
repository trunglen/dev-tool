import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompressRoutingModule } from './compress-routing.module';
import { CssCompressComponent } from './css-compress/css-compress.component';
import { JsCompressComponent } from './js-compress/js-compress.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CompressRoutingModule,
    SharedModule
  ],
  declarations: [
    CssCompressComponent,
    JsCompressComponent
  ]
})
export class CompressModule { }
