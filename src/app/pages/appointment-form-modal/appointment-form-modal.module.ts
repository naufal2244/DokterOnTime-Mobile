import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentFormSharedModule } from '../shared/appointment-form-shared.module';
import { AppointmentFormModalPage } from './appointment-form-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentFormModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AppointmentFormSharedModule
  ]
})
export class AppointmentFormModalPageModule {}
