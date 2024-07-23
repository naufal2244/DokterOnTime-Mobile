import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ProviderService } from 'src/app/services/provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {
  items: any;
  id: number;
  imgURL: string = this.providerSvc.imgURL;
  empty: number;

  constructor(private storage: Storage, private providerSvc: ProviderService, private router: Router) { }

  ngOnInit() {
    this.storage.get('USER_INFO').then(data => {
      if (data != null) {
        this.id = data[0].patient_id;
        this.getAppointmentData(this.id);
      }
    }, error => {
      console.log(error);
    });
  }

  doRefresh(event) {
    this.getAppointmentData(this.id);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getAppointmentData(id: number) {
    let postData = JSON.stringify({
      patientID: this.id
    });

    this.providerSvc.postData('appointment-list.php', postData)
      .subscribe(data => {
        if (Array.isArray(data) && data.length > 0) {
          this.items = data.map(item => {
            item.session_start = this.formatTime(item.session_start);
            item.session_end = this.formatTime(item.session_end);
            return item;
          });
          this.empty = 0;
        } else {
          this.empty = 1;
          console.log('No Data Available');
        }
      }, error => {
        console.log('Load Failed', error);
      });
  }

  formatTime(time: string): string {
    // Menghapus .00 di akhir
    return time.replace(/:00$/, '');
  }

  appointmentProfile(id: number) {
    this.router.navigate(['confirmation'], { queryParams: { appointmentId: id } });
  }
}
