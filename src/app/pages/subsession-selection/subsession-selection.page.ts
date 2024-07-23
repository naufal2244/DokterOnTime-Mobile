import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subsession-selection',
  templateUrl: './subsession-selection.page.html',
  styleUrls: ['./subsession-selection.page.scss'],
})
export class SubsessionSelectionPage implements OnInit {
  doctorId: number;
  selectedDate: string;
  sessionId: number;
  sessionLabel: string;
  dayId: number;
  availableSessions: any = {};
  subSessions: string[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = +params['sessionId'];
      this.route.queryParams.subscribe(queryParams => {
        this.sessionLabel = queryParams['sessionLabel'];
        this.doctorId = +queryParams['doctorId'];
        this.selectedDate = queryParams['date'];
        this.dayId = +queryParams['dayId'];
        this.generateSubSessions(this.sessionId);
        this.checkAvailability();
      });
    });
  }

  generateSubSessions(sessionId: number) {
    const sessionStartTimes = {
      1: '08:00',
      2: '09:00',
      3: '10:00',
      4: '11:00',
      5: '12:00',
      6: '13:00',
      7: '14:00',
      8: '15:00',
      9: '16:00',
      10: '17:00',
      11: '18:00',
      12: '19:00',
      13: '20:00',
      14: '21:00',
      15: '22:00'
    };

    const sessionStart = sessionStartTimes[sessionId];
    if (sessionStart) {
      const [hours, minutes] = sessionStart.split(':').map(Number);
      this.subSessions = [
        this.formatTime(hours, minutes) + ' - ' + this.formatTime(hours, minutes + 20),
        this.formatTime(hours, minutes + 20) + ' - ' + this.formatTime(hours, minutes + 40),
        this.formatTime(hours, minutes + 40) + ' - ' + this.formatTime(hours + 1, 0)
      ];
    }
  }

  formatTime(hours: number, minutes: number): string {
    return `${this.padZero(hours)}:${this.padZero(minutes)}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  checkAvailability() {
    const url = `http://localhost/doclabWeb/patient/doctor_availabilities.php?doctorId=${this.doctorId}&dayId=${this.dayId}&timeBlockId=${this.sessionId}&selectedDate=${this.selectedDate}`;
    console.log(`Fetching availability from: ${url}`);
    this.http.get(url).subscribe((data: any) => {
      console.log("Received availability data:", data);
      this.availableSessions = data.reduce((acc, curr) => {
        acc[curr.session_id] = curr.isAvailable;
        return acc;
      }, {});
    }, (error) => {
      console.error("Error fetching availability:", error);
    });
  }

  isSessionAvailable(sessionId: number): boolean {
    return this.availableSessions[sessionId] === 1;
  }

  selectSubSession(subSessionId: number) {
    const actualSessionId = (this.sessionId - 1) * 3 + subSessionId;
    this.router.navigate(['/appointment-form'], {
      queryParams: {
        doctorId: this.doctorId,
        sessionId: actualSessionId,
        date: this.selectedDate,
      }
    });
  }
}
