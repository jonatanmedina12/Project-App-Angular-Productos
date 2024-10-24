import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-100%)'
      })),
      transition('void <=> *', animate('0.3s ease-in-out')),
    ]),
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(-100%)'
      })),
      transition('in => out', animate('0.3s ease-in-out')),
      transition('out => in', animate('0.3s ease-in-out'))
    ])
  ]
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isScrolled = false;
  menuState = 'in';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }

  toggleSidenav() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }
}
