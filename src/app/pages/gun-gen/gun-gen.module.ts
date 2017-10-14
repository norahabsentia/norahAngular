import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GunGenComponent } from './gun-gen.component';
import { GunInterpService } from './gun-gen.service';
import { HeightMapSocketService } from './HeightMapSocketService';
import {GunGenImgDirective } from './gun-gen-img.directive';
import { StarRatingModule } from 'angular-star-rating';

const routes: Routes = [
  {path: '', component: GunGenComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StarRatingModule.forRoot()
  ],
  declarations: [
    GunGenComponent,GunGenImgDirective
  ],
  exports: [
    RouterModule,
    GunGenComponent,
  ],
  entryComponents: [GunGenComponent],
  providers: [GunInterpService, HeightMapSocketService]
})
export class GunInterpModule {
}
