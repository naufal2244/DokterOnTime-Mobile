import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppointmentFormModalPage } from '../appointment-form-modal/appointment-form-modal.page';

@NgModule({
  declarations: [AppointmentFormModalPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [AppointmentFormModalPage],
  entryComponents: [AppointmentFormModalPage]
})
export class AppointmentFormSharedModule {}
