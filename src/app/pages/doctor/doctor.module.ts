// src/app/pages/doctor/doctor.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { DoctorPage } from './doctor.page';
import { SharedModule } from '../shared/shared.module'; // Impor SharedModule

const routes: Routes = [
  {
    path: '',
    component: DoctorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule // Tambahkan SharedModule di sini
  ],
  declarations: [DoctorPage],
  entryComponents: [],
})
export class DoctorPageModule {}
