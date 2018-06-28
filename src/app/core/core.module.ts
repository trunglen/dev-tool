import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './loading/loading.component';
import { SeoService } from '../seo.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    LoadingComponent
  ],
  declarations: [LoadingComponent],
  providers: [
    SeoService
  ]
})
export class CoreModule { }
