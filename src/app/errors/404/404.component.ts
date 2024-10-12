import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-404',
  templateUrl: './404.component.html',
  styleUrl: './404.component.scss',
})
export class Component404 {
  url: string = '';

  constructor(private router: Router) {
    this.url = this.router.url;
  }

  // Redirect to Home
  redirectToHome() {
    this.router.navigateByUrl('/');
  }
}
