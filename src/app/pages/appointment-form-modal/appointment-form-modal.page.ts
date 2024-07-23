import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-appointment-form-modal',
  templateUrl: './appointment-form-modal.page.html',
  styleUrls: ['./appointment-form-modal.page.scss'],
})
export class AppointmentFormModalPage implements OnInit {
  items = [];
  filteredItems = [];
  searchTerm: string = '';

  constructor(private navParams: NavParams, private modalController: ModalController) { }

  ngOnInit() {
    this.items = this.navParams.get('items');
    this.filteredItems = [...this.items];
    console.log("Items loaded:", this.items);
  }

  filterItems(event: any) {
    const searchTerm = event.target.value;
    console.log("Search Term:", searchTerm);
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredItems = [...this.items];
    } else {
      const lowerCaseTerm = searchTerm.toLowerCase();
      this.filteredItems = this.items.filter(item => item.nama.toLowerCase().includes(lowerCaseTerm));
    }
  }

  dismiss() {
    const selectedItems = this.items.filter(item => item.selected);
    this.modalController.dismiss(selectedItems);
  }
}
