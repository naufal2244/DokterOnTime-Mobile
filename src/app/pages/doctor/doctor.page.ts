  import { AppointmentDetailPage } from '../appointment-detail/appointment-detail.page';
  import { ReviewDetailsPage } from '../review-details/review-details.page';

  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { HttpClient } from '@angular/common/http';
  import { ToastController, AlertController, ModalController } from '@ionic/angular';
  import { ProviderService } from 'src/app/services/provider.service';
  import { DatePipe } from '@angular/common';
  import { Storage } from '@ionic/storage';
  import { ControllersService } from 'src/app/services/controllers.service';
  

  @Component({
    selector: 'app-doctor',
    templateUrl: './doctor.page.html',
    styleUrls: ['./doctor.page.scss'],
  })
  export class DoctorPage implements OnInit {
    items: any;
    itemsSchedule: any;
    doctorID: any;
    clinicID: any;
    firstname: any;
    lastname: any;
    patientID: any;
    patientEmail: any;
    patientName: any;
    doctorName: any;
    imgURL: string;

    itemsSpec: any;

    minDate: string;

    constructor(public activatedRoute: ActivatedRoute,
      private http: HttpClient,
      public toastCtrl: ToastController,
      public router: Router,
      private providerSvc: ProviderService,
      private storage: Storage,
      public datePipe: DatePipe,
      public alertController: AlertController,
      public modalController: ModalController,
      public ctrl: ControllersService ) { }

    ngOnInit() {
      this.doctorID = this.activatedRoute.snapshot.params['did'];
      this.getData(this.doctorID);
      this.getRating();

      this.storage.get('USER_INFO').then(data => {
        if (data != null) {
          this.patientID = data[0].patient_id;
          this.patientEmail = data[0].patient_email;
          this.patientName = data[0].patient_firstname + data[0].patient_lastname;
        }
      }, error => {
        console.log(error);
      });

      this.minDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    }

    getData(id: number) {
      let postData = JSON.stringify({
        doctorID: id
      });

      this.providerSvc.postData('doctor_profile.php', postData).subscribe(data => {
        if (data != null) {
          this.items = data[0]; // Assuming the API returns an array with one object
          console.log(data);

          this.lastname = this.items.doctor_lastname;
          this.firstname = this.items.doctor_firstname;
          this.doctorName = this.firstname + this.lastname;
          this.clinicID = this.items.clinic_id;
          this.imgURL = this.providerSvc.imgURL;

          // Pastikan bahwa clinic_name diambil dan disimpan dalam items
          this.items.clinic_name = this.items.clinic_name;
        }
      }, error => {
        console.log("Load Failed", error);
      });
  }


    countReviews: number;
    rate: any;
    totalReviewRate: number;
    rateitems: any;
    
    getRating() {
      let postData = JSON.stringify({
        doctorID: this.doctorID
      });
      this.providerSvc.postData('review-details.php', postData).subscribe(data => {
        if (data != null) {
          this.countReviews = Object.keys(data).length;

          var onecount = 0;
          var twocount = 0;
          var threecount = 0;
          var fourcount = 0;
          var fivecount = 0;

          for (var i = 0; i < this.countReviews; i++) {
            this.rate = parseInt(data[i].rating, 10);

            if (this.rate == 5) {
              fivecount++;
            } else if (this.rate == 4) {
              fourcount++;
            } else if (this.rate == 3){
              threecount++;
            } else if (this.rate == 2){
              twocount++;
            } else if (this.rate == 1){
              onecount++;
            }
          }
          
          var roundTotal = (5*fivecount + 4*fourcount + 3* threecount + 2*twocount + 1*onecount) / this.countReviews;
          this.totalReviewRate = Math.round( roundTotal * 10 ) / 10;
        } else {
          console.log('No Data Available');
        }
      }, error => {
        console.log(error);
      });
    }

    selectedTime: string;

    TimeSlotChange($event) {
      this.selectedTime = $event.detail.value;
      console.log(this.selectedTime);
    }

    selectedDate: string;

    DateSlotChange(event) {
      if (event && event.detail && event.detail.value) {
        this.selectedDate = this.datePipe.transform(event.detail.value, 'yyyy-MM-dd');
        console.log(this.selectedDate); // Tambahkan log untuk memastikan nilai
      } else {
        console.log("DateSlotChange: event.detail.value is null or undefined");
      }
    }

    async presentAlert() {
      const alert = await this.alertController.create({
        header: 'Kesalahan!',
        message: 'Silahakan pilih tanggal periksa sebelum melanjutkan!',
        buttons: ['OK']
      });
  
      await alert.present();
    }
    
    
    GoToSessionSelection() {
      if (this.selectedDate) {
        console.log("Navigating to session-selection with date:", this.selectedDate, "and doctorId:", this.doctorID);
        this.router.navigate(['/session-selection'], { queryParams: { date: this.selectedDate, doctorId: this.doctorID  } });
      } else {
        this.presentAlert();
      }
    }
    

    Book() {
      if (this.selectedDate != null) {
        this.openModal();
      } else {
        this.ctrl.alertPopUp("Attention", "Please select date & time", "OK");
      }
    }

    async openModal() {
      const modal = await this.modalController.create({
        component: AppointmentDetailPage,
        componentProps: {
          date: this.selectedDate,
          time: this.selectedTime,
          doctorID: this.doctorID,
          clinicID: this.clinicID,
          patientID: this.patientID,
          patientEmail: this.patientEmail,
          patientName: this.patientName,
          doctorName: this.doctorName,
        }
      });
      modal.onDidDismiss().then(dataReturned => {
      });
      return await modal.present();
    }
    
    async reviewModal() {
      const modal = await this.modalController.create({
        component: ReviewDetailsPage,
        componentProps: {
          doctorID: this.doctorID
        }
      });

      return await modal.present();
    }
  }
