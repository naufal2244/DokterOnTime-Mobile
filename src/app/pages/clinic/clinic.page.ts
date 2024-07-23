import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.page.html',
  styleUrls: ['./clinic.page.scss'],
})
export class ClinicPage implements OnInit {
  clinicID: number;
  items: any;
  itemsImg: any;
  specialities: any;
  name: string;
  contact: number;
  email: string;
  address: string;
  city: string;
  state: string;
  url: string;
  zipcode: number;
  avatar: any;
  piclink: string;

  busitems: any;
  weekopen: string;
  weekclose: string;
  satopen: string = '--';
  satclose: string = '--';
  sunopen: string = '--';
  sunclose: string = '--';

  imgFilename: string;
  iconLink: string;

  sliderConfig = {
    spaceBetween: 10,
    centeredSlides: false,
    slidesPerView: 1.2
  };

  constructor(public activatedRoute: ActivatedRoute, private http: HttpClient, private router: Router, private providerSvc: ProviderService) {}

  ngOnInit() {
    this.clinicID = this.activatedRoute.snapshot.params['cid'];
    this.getData(this.clinicID);
    this.getImageData(this.clinicID);
    this.getBusinessHourData(this.clinicID);
    this.getSpecialities();
  }

  getData(id: number) {
    let postData = JSON.stringify({ clinicID: id });

    this.providerSvc.postData('clinic_profile.php', postData)
      .subscribe(data => {
        if (data != null) {
          this.items = data;
          console.log('Clinic Data:', data);
          
          this.name = this.items[0].clinic_name;
          this.contact = this.items[0].clinic_contact;
          this.email = this.items[0].clinic_email;
          this.address = this.items[0].clinic_address;
          this.city = this.items[0].clinic_city;
          this.state = this.items[0].clinic_state;
          this.url = this.items[0].clinic_url;
          this.zipcode = this.items[0].clinic_zipcode;

          this.avatar = this.items[0].doctor_avatar;
          this.piclink = this.providerSvc.imgURL + this.items[0].clinic_id + "/doctor/";

          if (this.avatar == null) {
            this.piclink = "";
            this.avatar = this.providerSvc.emptyURL;
          }
        } else {
          console.log('No Data Available for Clinic');
        }
      }, error => {
        console.log('Load Failed:', JSON.stringify(error.json()));
      });
  }

  getImageData(id: number) {
    let postData = JSON.stringify({ clinicID: id });

    this.providerSvc.postData('clinic_image.php', postData)
      .subscribe(data => {
        if (data != null) {
          this.itemsImg = data;
          console.log('Image Data:', data);

          this.imgFilename = this.providerSvc.imgURL + this.itemsImg[0].clinic_id + "/clinic/";
        } else {
          console.log('No Image Data Available');
        }
      }, error => {
        console.log('Load Failed:', JSON.stringify(error.json()));
      });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getBusinessHourData(id: number) {
    let postData = JSON.stringify({ clinicID: id });

    this.providerSvc.postData('business_hour.php', postData)
      .subscribe(data => {
        if (data != null) {
          this.busitems = data;
          console.log('Business Hour Data:', data);

          // Mapping the business hours based on day_id
          const weekDays = this.busitems.filter(item => item.days_id <= 5);
          console.log('Weekdays:', weekDays);
          if (weekDays.length > 0) {
            this.weekopen = this.formatTime(weekDays[0].open_time);
            this.weekclose = this.formatTime(weekDays[0].close_time);
          }
          
          const saturday = this.busitems.find(item => item.days_id === 6);
          console.log('Saturday Data:', saturday);
          if (saturday) {
            this.satopen = this.formatTime(saturday.open_time);
            this.satclose = this.formatTime(saturday.close_time);
          }
          
          const sunday = this.busitems.find(item => item.days_id === 7);
          console.log('Sunday Data:', sunday);
          if (sunday) {
            this.sunopen = this.formatTime(sunday.open_time);
            this.sunclose = this.formatTime(sunday.close_time);
          }
        } else {
          console.log('No Business Hour Data Available');
        }
      }, error => {
        console.log('Load Failed:', JSON.stringify(error.json()));
      });
  }

  getSpecialities() {
    this.providerSvc.getData('speciality.php').subscribe(data => {
      if (data != null) {
        this.specialities = data;
        console.log('Specialities Data:', data);
        this.iconLink = this.providerSvc.iconURL;
      } else {
        console.log("No Specialities Found");
      }
    }, error => {
      console.log("Load Specialities Failed:", JSON.stringify(error));
    });
  }

  navigateToDoctorList(hospitalId: number, specialityId: number) {
    console.log(`Navigating to doctor-list with hospitalId: ${hospitalId} and specialityId: ${specialityId}`);
    this.router.navigate(['/doctor-list', hospitalId, specialityId]);
  }

  viewDoctors(hospitalId: number, specialityId: number) {
    this.navigateToDoctorList(hospitalId, specialityId);
  }
}
