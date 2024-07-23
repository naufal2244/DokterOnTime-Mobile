import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { AppointmentFormModalPage } from '../appointment-form-modal/appointment-form-modal.page';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.page.html',
  styleUrls: ['./appointment-form.page.scss'],
})
export class AppointmentFormPage implements OnInit {
  patient_id: number;
  doctorId: number;
  sessionId: number;
  selectedDate: string;

  keluhan: string;
  deskripsi_keluhan: string;
  nama_lengkap: string;
  email: string;
  no_hp: string;
  tinggi_badan: number;
  berat_badan: number;
  tanggal_lahir: string;

  penyakitList = [];
  ortuList = [];
  alergiList = [];
  operasiList = [];
  pengobatanList = [];

  selectedPenyakit = [];
  selectedOrtu = [];
  selectedAlergi = [];
  selectedOperasi = [];
  selectedPengobatan = [];

  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController // Tambahkan ini
  ) {}

  ngOnInit() {
    this.patient_id = +localStorage.getItem('patient_id');
    if (!this.patient_id) {
      console.error("Patient ID not found in localStorage");
    } else {
      this.loadDropdownData();
    }

    this.route.queryParams.subscribe(params => {
      this.doctorId = +params['doctorId'];
      this.sessionId = +params['sessionId'];
      this.selectedDate = params['date'];
    });
  }

  loadDropdownData() {
    this.http.get<any>('http://localhost/doclabWeb/patient/get_patient_data.php')
      .subscribe(response => {
        console.log("Data dari server:", response);
        this.penyakitList = response.penyakit;
        this.ortuList = response.ortu;
        this.alergiList = response.alergi;
        this.operasiList = response.operasi;
        this.pengobatanList = response.pengobatan;
      }, error => {
        console.error("Error loading dropdown data:", error);
      });
  }

  async openModal(type: string) {
    let list = [];
    if (type === 'penyakit') list = this.penyakitList;
    else if (type === 'ortu') list = this.ortuList;
    else if (type === 'alergi') list = this.alergiList;
    else if (type === 'operasi') list = this.operasiList;
    else if (type === 'pengobatan') list = this.pengobatanList;

    const modal = await this.modalController.create({
      component: AppointmentFormModalPage,
      componentProps: {
        items: list
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        console.log("Data yang dipilih:", data.data);
        this[`selected${type.charAt(0).toUpperCase() + type.slice(1)}`] = data.data;
      }
    });
    
    return await modal.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Mengonfirmasi janji temu Anda...',
      duration: 2000 // Atur durasi loading sesuai kebutuhan
    });
    await loading.present();
    return loading;
  }

  async submitAppointmentForm() {
    if (!this.nama_lengkap || !this.email || !this.no_hp || !this.keluhan || !this.deskripsi_keluhan || !this.tinggi_badan || !this.berat_badan || !this.tanggal_lahir) {
        const alert = await this.alertController.create({
            header: 'Data Tidak Lengkap!!',
            message: 'Harap lengkapi data',
            buttons: ['OK']
        });
        await alert.present();
        return;
    }

    const loading = await this.presentLoading();

    const data = {
        patient_id: this.patient_id,
        doctor_id: this.doctorId,
        session_id: this.sessionId,
        tanggal_janji: this.selectedDate,
        status_periksa: 0,
        keluhan: this.keluhan,
        deskripsi_keluhan: this.deskripsi_keluhan,
        nama_lengkap: this.nama_lengkap,
        email: this.email,
        no_hp: this.no_hp,
        tinggi_badan: this.tinggi_badan,
        berat_badan: this.berat_badan,
        tanggal_lahir: this.tanggal_lahir,
        selectedPenyakit: this.selectedPenyakit,
        selectedOrtu: this.selectedOrtu,
        selectedAlergi: this.selectedAlergi,
        selectedOperasi: this.selectedOperasi,
        selectedPengobatan: this.selectedPengobatan
    };

    this.http.post('http://localhost/doclabWeb/patient/submit_appointment.php', data).subscribe(
        async (response: any) => {
            await loading.dismiss(); // Tutup loading setelah selesai
            console.log("Form submitted successfully:", response);
            const alert = await this.alertController.create({
                header: 'Pendaftaran Berhasil!',
                message: 'Janji temu berhasil dibuat.',
                buttons: [
                    {
                        text: 'OK',
                        handler: async () => {
                            const appointmentId = response.appointmentId;
                            const appointmentData = await this.getAppointmentData(appointmentId);
                            if (appointmentData) {
                                this.router.navigate(['/confirmation'], {
                                    queryParams: { appointmentId }
                                });
                            } else {
                                const alert = await this.alertController.create({
                                    header: 'Error',
                                    message: 'Gagal mengambil data janji temu.',
                                    buttons: ['OK']
                                });
                                await alert.present();
                            }
                        }
                    }
                ]
            });
            await alert.present();
        },
        async (error) => {
            await loading.dismiss(); // Tutup loading jika ada error
            console.error("Error submitting form:", error);
            const alert = await this.alertController.create({
                header: 'Error',
                message: 'Terjadi kesalahan saat mengirim form.',
                buttons: ['OK']
            });
            await alert.present();
        }
    );
}

async getAppointmentData(appointmentId: string) {
    return new Promise((resolve, reject) => {
        this.http.get(`http://localhost/doclabWeb/patient/get_appointment_data.php?appointmentId=${appointmentId}`).subscribe(
            (data: any) => {
                if (data) {
                    resolve(data);
                } else {
                    reject('Data not found');
                }
            },
            (error) => {
                reject(error);
            }
        );
    });
}
}
