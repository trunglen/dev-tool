import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SassToCssComponent } from './sass-to-css/sass-to-css.component';
import { TestApiOnlineComponent } from './test-api-online/test-api-online.component';
import { EpochConverterComponent } from './epoch-converter/epoch-converter.component';
import { ImageToBase64Component } from './image-to-base64/image-to-base64.component';
import { DatabaseCheatSheetComponent } from './database-cheat-sheet/database-cheat-sheet.component';

const routes: Routes = [

    { path: 'minify', loadChildren: './compress/compress.module#CompressModule' },
    { path: 'json-utils', loadChildren: './json-utils/json-utils.module#JsonUtilsModule' },
    { path: 'sass-to-css', component: SassToCssComponent },
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
