import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tensi-modal',
  templateUrl: './tensi-modal.page.html',
  styleUrls: ['./tensi-modal.page.scss'],
})
export class TensiModalPage {
  systolic: number;
  diastolic: number;
  appointmentId: number;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.appointmentId = this.navParams.get('appointmentId');
  }

  closeModal() {
    console.log('Closing modal');
    this.modalCtrl.dismiss();
  }

  async saveTensi() {
    const tensi = `${this.systolic}/${this.diastolic} mmHg`;
    const postData = {
      appointmentId: this.appointmentId,
      tensi: tensi
    };

    try {
      await this.http.post('http://localhost/doclabWeb/patient/update_tensi.php', postData).toPromise();
      const alert = await this.alertController.create({
        header: 'Berhasil!',
        message: 'Data tensi berhasil disimpan.',
        buttons: ['OK']
      });
      await alert.present();
      this.modalCtrl.dismiss({
        'dismissed': true,
        'data': {
          tensi: tensi
        }
      });
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Terjadi kesalahan saat menyimpan data tensi.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }


}
