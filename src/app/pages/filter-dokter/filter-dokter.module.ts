import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { FilterDokterPage } from "./filter-dokter.page";

const routes: Routes = [
  {
    path: "",
    component: FilterDokterPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [FilterDokterPage],
})
export class FilterDokterPageModule {}
