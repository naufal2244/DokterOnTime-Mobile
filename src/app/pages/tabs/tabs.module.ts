import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs', // ! Can put at the app-routing.module.ts
    component: TabsPage,
    // ! Edited
    children: [
      {
        path: 'home',
        loadChildren: '../home/home.module#HomePageModule'
      },
      {
        path: 'appointment',
        loadChildren: '../appointment/appointment.module#AppointmentPageModule'
      },
      {
        path: 'riwayat-medis',
        loadChildren: '../riwayat-medis/riwayat-medis.module#RiwayatMedisPageModule'
      },
      {
        path: 'message',
        loadChildren: '../message/message.module#MessagePageModule'
      },
      {
        path: 'profile',
        loadChildren: '../profile/profile.module#ProfilePageModule'
      },
      {
        path: 'search',
        loadChildren: '../search/search.module#SearchPageModule'
      },

    
    ]
    // ! End
  },
  // ! Edited
  // {
  //   path: '',
  //   redirectTo: '/tabs/home',
  //   pathMatch: 'full'
  // },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
