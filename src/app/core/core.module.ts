import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports:[
    LoadingComponent
  ],
  declarations: [LoadingComponent]
})
export class CoreModule { }
