import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent {
  showWelcome = true;

  features = [
    { icon: 'speed', title: 'Fast', description: 'Lightning-fast performance' },
    { icon: 'security', title: 'Secure', description: 'Top-notch security measures' },
    { icon: 'devices', title: 'Responsive', description: 'Works on all devices' },
  ];
  startShopping() {
    this.showWelcome = false;
  }
}
