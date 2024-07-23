import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ProviderService } from 'src/app/services/provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-riwayat-medis',
  templateUrl: './riwayat-medis.page.html',
  styleUrls: ['./riwayat-medis.page.scss'],
})
export class RiwayatMedisPage implements OnInit {
  items: any;
  id: number;
  imgURL: string = this.providerSvc.imgURL;
  empty: number;

  constructor(private storage: Storage, private providerSvc: ProviderService, private router: Router) { }

  ngOnInit() {
    this.storage.get('USER_INFO').then(data => {
      if (data != null) {
        this.id = data[0].patient_id;
        this.getRiwayatMedisData(this.id);
      }
    }, error => {
      console.log(error);
    });
  }

  doRefresh(event) {
    this.getRiwayatMedisData(this.id);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getRiwayatMedisData(id: number) {
    let postData = JSON.stringify({
      patientID: this.id,
      status_periksa: 2 // Untuk mengambil data dengan status_periksa 2
    });

    this.providerSvc.postData('riwayat-medis-list.php', postData)
      .subscribe(data => {
        if (data != null) {
          this.items = data;
          this.empty = 0;
        } else {
          this.empty = 1;
          console.log('No Data Available');
        }
      }, error => {
        console.log('Load Failed', error);
      });
  }

  viewDetail(id: number) {
    this.router.navigate(['riwayat-medis-detail'], { queryParams: { appointmentId: id } });
  }
}
