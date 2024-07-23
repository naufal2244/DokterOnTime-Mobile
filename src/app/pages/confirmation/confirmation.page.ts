import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TensiModalPage } from '../tensi-modal/tensi-modal.page'; // Import modal page

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.page.html',
    styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
    appointmentData: any;
    displayAntrian: string;
    currentAntrianDilayani: string;
    previousAntrian: string;
    previousSessionStart: string;
    previousSessionEnd: string;
    appointmentId: string; // Add this line

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private modalController: ModalController // Inject ModalController
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.appointmentId = params['appointmentId']; // Get appointmentId
            console.log('Appointment ID:', this.appointmentId); // Log the appointmentId
            this.fetchAppointmentData(this.appointmentId);
        });
    }

    fetchAppointmentData(appointmentId: string) {
        this.http.get(`http://localhost/doclabWeb/patient/get_appointment_data.php?appointmentId=${appointmentId}`).subscribe(
            (data: any) => {
                this.appointmentData = data;
                console.log('Appointment Data:', this.appointmentData);

                // Extract the kode_dokter and nomor_sesi from nomor_antrian
                const antrianParts = this.appointmentData.nomor_antrian.split('-');
                this.displayAntrian = `${antrianParts[0]}-${antrianParts[2]}`;

                // Extract previous antrian
                const previousAntrianId = antrianParts[2] - 1;
                this.previousAntrian = `${antrianParts[0]}-${previousAntrianId.toString().padStart(3, '0')}`;

                // Set the previous session times
                this.previousSessionStart = this.formatTime(this.appointmentData.previous_session_start);
                this.previousSessionEnd = this.formatTime(this.appointmentData.previous_session_end);

                // Format appointment times
                this.appointmentData.session_start = this.formatTime(this.appointmentData.session_start);
                this.appointmentData.session_end = this.formatTime(this.appointmentData.session_end);

                // Process pasien dilayani to display the extracted nomor antrian
                this.currentAntrianDilayani = this.appointmentData.pasien_dilayani
                    .map(antrian => {
                        const parts = antrian.split('-');
                        return `${parts[0]}-${parts[2]}`;
                    })
                    .join(', ') || '-';
            },
            error => {
                console.error('Error fetching appointment data:', error);
            }
        );
    }

    formatTime(time: string): string {
        // Menghapus .00 di akhir
        return time.replace(/:00$/, '');
    }

    async openTensiModal() {
        const modal = await this.modalController.create({
            component: TensiModalPage,
            componentProps: {
                appointmentId: this.appointmentId // Pass appointmentId to modal
            }
        });

        modal.onDidDismiss().then((data) => {
            if (data.data) {
                console.log("Tensi data submitted:", data.data);
                this.updateTensiData(data.data);
            }
        });

        return await modal.present();
    }

    updateTensiData(tensiData: any) {
        const updateData = {
            appointmentId: this.appointmentId,
            tensi: tensiData.tensi
        };

        this.http.post('http://localhost/doclabWeb/patient/update_tensi.php', updateData).subscribe(
            (response: any) => {
                console.log("Tensi data updated successfully:", response);
                this.fetchAppointmentData(this.appointmentId); // Refresh appointment data
            },
            error => {
                console.error("Error updating tensi data:", error);
            }
        );
    }

    goToHomePage() {
        this.router.navigate(['/tabs/home']);
    }
}
