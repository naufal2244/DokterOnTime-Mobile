import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ControllersService } from 'src/app/services/controllers.service';
import { ProviderService } from 'src/app/services/provider.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  formData: any = {};
  id: string;

  constructor(private storage: Storage, 
              public ctrl: ControllersService, 
              private providerSvc: ProviderService,
              public datePipe: DatePipe) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.storage.get('USER_INFO').then(data => {
      if (data != null) {
        this.id = data[0].patient_id;
        this.formData.lastname = data[0].patient_lastname;
        this.formData.firstname = data[0].patient_firstname;
        this.formData.email = data[0].patient_email;
        this.formData.identity = data[0].patient_identity;
        this.formData.gender = data[0].patient_gender;
        this.formData.dob = data[0].patient_dob;
        this.formData.contact = data[0].patient_contact;
        this.formData.maritalstatus = data[0].patient_maritalstatus;
      }
    }, error => {
      console.log(error);
    });
  }
  
  Save() {
    this.storage.get('USER_INFO').then(data => {
      if (data != null) {
        this.id = data[0].patient_id;
      }
    }, error => {
      console.log(error);
    });

    if (this.formData.lastname != null && this.formData.firstname != null && this.formData.email != null && this.formData.identity != null && this.formData.gender != null && this.formData.dob != null && this.formData.contact != null && this.formData.maritalstatus != null) {
      if (this.formData.lastname.match(this.ctrl.pattern.text) && this.formData.firstname.match(this.ctrl.pattern.text)) {
        if (this.formData.email.match(this.ctrl.pattern.email)) {
          if (!isNaN(this.formData.contact) && this.formData.contact.length < 14) {
            let dataPost = new FormData();
            dataPost.append('inputID', this.id);
            dataPost.append('inputFirstname', this.formData.firstname);
            dataPost.append('inputLastname', this.formData.lastname);
            dataPost.append('inputEmail', this.formData.email);
            dataPost.append('inputIdentity', this.formData.identity);
            dataPost.append('inputDOB', this.formData.dob);
            dataPost.append('inputGender', this.formData.gender);
            dataPost.append('inputContact', this.formData.contact);
            dataPost.append('inputMaritalStatus', this.formData.maritalstatus);
    
            this.providerSvc.postData("profile-edit.php", dataPost).subscribe(res => {
              this.ctrl.alertPopUp("Berhasil!", "Data diupdate", "OK");
              this.storage.set('USER_INFO', res).then((data) => {
                this.getData();
              });
            }, error => {
              console.log(error);
            });
          } else {
            this.ctrl.alertPopUp("Perhatian", "Nomor Kontak hanya boleh berupa angka dan tidak boleh lebih dari 13!", "Coba Lagi");
          }
        } else {
          this.ctrl.alertPopUp("Perhatian", "Format Email Tidak Valid!", "Coba Lagi");
        }
      } else {
        this.ctrl.alertPopUp("Perhatian", "Nama Depan/Nama Belakang hanya boleh berupa teks!", "Coba Lagi");
      }
    } else {
      this.ctrl.alertPopUp("Perhatian", "Semua form wajib diisi!", "Coba Lagi");
    }

  }
}
