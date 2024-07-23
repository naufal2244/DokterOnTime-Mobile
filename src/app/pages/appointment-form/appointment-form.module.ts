import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentFormPage } from './appointment-form.page';
import { AppointmentFormSharedModule } from '../shared/appointment-form-shared.module';

const routes: Routes = [
  {
    path: '',
    component: AppointmentFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AppointmentFormSharedModule
  ],
  declarations: [AppointmentFormPage]
})
export class AppointmentFormPageModule {}
