import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JsonToTsComponent } from './json-to-ts/json-to-ts.component';
import { SassToCssComponent } from '../sass-to-css/sass-to-css.component';
import { JsonValidatorComponent } from './json-validator/json-validator.component';
import { JsonHolderComponent } from './json-holder/json-holder.component';
import { JsonToGoComponent } from './json-to-go/json-to-go.component';
import { JsonParserComponent } from './json-parser/json-parser.component';

const routes: Routes = [
  { path: 'json-to-ts', component: JsonToTsComponent },
  { path: 'json-validator', component: JsonValidatorComponent },
  { path: 'json-holder', component: JsonHolderComponent },
  { path: 'json-to-go', component: JsonToGoComponent },
  { path: 'json-parser', component: JsonParserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JsonUtilsRoutingModule { }
