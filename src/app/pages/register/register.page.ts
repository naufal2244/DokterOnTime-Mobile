import { Component, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ProviderService } from 'src/app/services/provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formData: any = {};

  constructor(
    public ctrl: ControllersService,
    private providerSvc: ProviderService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  RegisterUser() {
    if (this.formData.email != null && this.formData.password != null && this.formData.lastname != null && this.formData.firstname != null && this.formData.identity != null) {
      if (this.formData.lastname.match(this.ctrl.pattern.text) && this.formData.firstname.match(this.ctrl.pattern.text)) {
        if (this.formData.email.match(this.ctrl.pattern.email)) {
          if (this.formData.password.length < 8) {
            this.ctrl.alertPopUp("Perhatian", "Kata Sandi Harus Terdiri dari Setidaknya 8 Karakter", "OK");
          } else {
            if (this.formData.password != this.formData.confirm_password ) {
              this.ctrl.alertPopUp("Perhatian", "Konfirmasi Kata Sandi Tidak Sama", "OK");
            } else {
              this.ctrl.presentLoading();
            
              let dataPost = new FormData();
              dataPost.append('inputlastname', this.formData.lastname);
              dataPost.append('inputfirstname', this.formData.firstname);
              dataPost.append('inputemail', this.formData.email);
              dataPost.append('inputidentity', this.formData.identity);
              dataPost.append('inputpassword', this.formData.password);
    
              this.providerSvc.postData("register.php", dataPost).subscribe(res => {
                if (res[0] == 1) {
                  this.ctrl.alertPopUp("Akun Berhasil Dibuat!", "Silakan masuk dengan akun yang telah dibuat.", "OK");
                  this.router.navigate(["login"]);
                } else {
                  this.ctrl.alertPopUp("Perhatian", "Email Sudah digunakan", "OK");
                }
              }, error => {
                console.log(error);
              });
            }
          }
        } else {
          this.ctrl.alertPopUp("Perhatian", "Format Email Tidak Valid", "OK");
        }
      } else {
        this.ctrl.alertPopUp("Perhatian", "Nama Depan/Belakang Hanya Boleh diisi dengan Teks", "OK");
      }
    } else {
      this.ctrl.alertPopUp("Perhatian", "Semua Isian Harus diisi", "OK");
    }
  }

}
