import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from 'src/app/services/provider.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  id: number;
  appointmentBadge: number;

  constructor(public activatedRoute: ActivatedRoute, private providerSvc: ProviderService, private storage: Storage) {}

  ngOnInit() {
    this.storage.get('USER_INFO').then(data => {
      if (data != null) {
        this.id = data[0].patient_id;
        this.getAppointments(this.id);
      }
    }, error => {
      console.log(error);
    });
  }

  getAppointments(id: number) {
    let postData = JSON.stringify({
      patientID: id
    });

    this.providerSvc.postData('appointment-list.php', postData)
      .subscribe((data: any[]) => {
        if (data != null) {
          this.appointmentBadge = data.length;
        } else {
          this.appointmentBadge = 0;
          console.log('No Data Available');
        }
      }, error => {
        console.log('Load Failed', error);
      });
  }
}
