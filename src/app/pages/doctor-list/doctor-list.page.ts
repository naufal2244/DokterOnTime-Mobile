import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.page.html',
  styleUrls: ['./doctor-list.page.scss'],
})
export class DoctorListPage implements OnInit {
  hospitalId: number;
  specialityId: number;
  doctors: any[] = [];
  imgURL: string;
  empty: number;

  constructor(
    private route: ActivatedRoute,
    private providerSvc: ProviderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.hospitalId = +this.route.snapshot.paramMap.get('hospitalId');
    this.specialityId = +this.route.snapshot.paramMap.get('specialityId');
    console.log(`Received hospitalId: ${this.hospitalId}, specialityId: ${this.specialityId}`);
    this.loadDoctors();
  }

  loadDoctors() {
    let postData = JSON.stringify({
      hospitalId: this.hospitalId,
      specialityId: this.specialityId
    });

    console.log(`Sending data to server: ${postData}`);

    this.providerSvc.postData('doctor_list.php', postData)
      .subscribe(data => {
        console.log(`Received data:`, data);
        if (Array.isArray(data) && data.length > 0) {
          this.doctors = data;
          this.imgURL = this.providerSvc.imgURL;
          this.empty = 0;
        } else {
          console.log("No Data");
          this.empty = 1;
        }
      }, error => {
        console.log("Load Data Failed:", JSON.stringify(error));
      });
  }

  filterData(searchData: any) {
    const val = searchData.target.value;
    if (val && val.trim() != '') {
      this.doctors = this.doctors.filter((item) => {
        var itemname = item.doctor_lastname + item.doctor_firstname;
        return (itemname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.loadDoctors();
    }
  }

  doctorProfile(id: number) {
    if (id != null) {
      this.router.navigate(['/doctor', id]);
    } else {
      console.log("Error");
    }
  }
}
