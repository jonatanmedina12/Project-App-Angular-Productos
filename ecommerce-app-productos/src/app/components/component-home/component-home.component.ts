import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-component-home',
  templateUrl: './component-home.component.html',
  styleUrls: ['./component-home.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('1s', style({ opacity: 1 }))
      ]),
    ]),
    trigger('slideIn', [
      state('void', style({ transform: 'translateY(50px)', opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
    ]),
  ]
})
export class ComponentHomeComponent {
  features = [
    { icon: 'inventory_2', text: 'Gestión de productos' },
    { icon: 'assessment', text: 'Control de inventario' },
 
  ];



}
