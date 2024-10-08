import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SubsessionSelectionPage } from './subsession-selection.page';

const routes: Routes = [
  {
    path: '',
    component: SubsessionSelectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SubsessionSelectionPage]
})
export class SubsessionSelectionPageModule {}
