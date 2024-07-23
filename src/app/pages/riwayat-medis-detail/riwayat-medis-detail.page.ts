import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-riwayat-medis-detail',
  templateUrl: './riwayat-medis-detail.page.html',
  styleUrls: ['./riwayat-medis-detail.page.scss'],
})
export class RiwayatMedisDetailPage implements OnInit {
  appointmentId: string;
  clinicName: string;
  doctorName: string;
  doctorSpeciality: string;
  appointmentDate: string;
  saranDokter: string;
  diagnosisList: any[] = [];
  tindakLanjutList: any[] = [];
  obatList: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.appointmentId = params['appointmentId'];
      this.fetchRiwayatMedisDetail(this.appointmentId);
    });
  }

  fetchRiwayatMedisDetail(appointmentId: string) {
    this.http.get(`http://localhost/doclabWeb/patient/get_riwayat_medis_detail.php?appointmentId=${appointmentId}`).subscribe(
      (data: any) => {
        console.log('Data fetched from server:', data); // Tambahkan log untuk debugging
        if (data) {
          this.appointmentDate = data[0].tanggal_janji;
          this.clinicName = data[0].clinic_name;
          this.doctorName = `Dr. ${data[0].doctor_firstname} ${data[0].doctor_lastname}`;
          this.doctorSpeciality = `Poli ${data[0].doctor_speciality}`;
          this.saranDokter = data[0].saran_dokter;
          this.diagnosisList = data.map(item => item.nama_diagnosis).filter((value, index, self) => self.indexOf(value) === index); // Ensures unique values
          this.tindakLanjutList = data.map(item => item.deskripsi_tindak_lanjut).filter((value, index, self) => self.indexOf(value) === index); // Ensures unique values
          this.obatList = data.map(item => ({
            nama_obat: item.nama_obat,
            deskripsi_dosis: item.deskripsi_dosis,
            deskripsi_frekuensi: item.deskripsi_frekuensi
          })).filter((value, index, self) => self.findIndex(v => v.nama_obat === value.nama_obat && v.deskripsi_dosis === value.deskripsi_dosis && v.deskripsi_frekuensi === value.deskripsi_frekuensi) === index); // Ensures unique values
        }
      },
      error => {
        console.error('Error fetching riwayat medis detail:', error);
      }
    );
  }
}
