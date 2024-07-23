import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RiwayatMedisPage } from './riwayat-medis.page';

const routes: Routes = [
  {
    path: '',
    component: RiwayatMedisPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RiwayatMedisPage]
})
export class RiwayatMedisPageModule { }
