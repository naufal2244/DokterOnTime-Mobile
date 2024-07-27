// src/app/pages/shared/shared.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentDetailPage } from '../appointment-detail/appointment-detail.page';
import { ReviewPage } from '../review/review.page';
import { ReviewDetailsPage } from '../review-details/review-details.page';

@NgModule({
  declarations: [
    AppointmentDetailPage,
    ReviewPage,
    ReviewDetailsPage
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AppointmentDetailPage,
    ReviewPage,
    ReviewDetailsPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
