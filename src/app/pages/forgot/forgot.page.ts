import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import { ControllersService } from 'src/app/services/controllers.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  formData: any = {};

  constructor(private providerSvc: ProviderService, public ctrl: ControllersService) { }

  ngOnInit() {
  }

  Forgot() {
    if (this.formData.email != null) {
      if (this.formData.email.match(this.ctrl.pattern.email)) {
        this.ctrl.presentLoading();
        let dataPost = new FormData();
        dataPost.append('inputEmail', this.formData.email);
        this.providerSvc.postData('forgot.php', dataPost).subscribe(res => {
          if (res[0] == 1) {
            this.ctrl.alertPopUp("Verifikasi Email", "Kirim", "OK");
          } else {
            this.ctrl.alertPopUp("Perhatian", "Email tidak terdaftar", "OK");
          }
        }, error => {
          console.log(error);
        });
      } else {
        this.ctrl.alertPopUp("Perhatian", "Invalid Email Format", "OK");
      }
    } else {
      this.ctrl.alertPopUp("Perhatian", "Silahkan Diisi", "OK");
    }
  }

}
