import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-session-selection',
  templateUrl: './session-selection.page.html',
  styleUrls: ['./session-selection.page.scss'],
})
export class SessionSelectionPage implements OnInit {
  selectedDate: string;
  doctorId: number;

  constructor(private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'];
      this.doctorId = params['doctorId'];
    });
  }

  selectSession(sessionId: number, sessionLabel: string) {
    const dayId = this.convertDateToDayId(this.selectedDate);
    this.router.navigate(['/subsession-selection', sessionId],  {
      queryParams: { sessionLabel: sessionLabel, doctorId: this.doctorId, date: this.selectedDate, dayId: dayId }
    });
  }

  convertDateToDayId(dateString: string): number {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 ? 7 : day;
  }
}
