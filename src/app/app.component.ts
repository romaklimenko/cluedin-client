import { PlatformLocation } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cluedin';

  constructor(
    public router: Router,
    private platformLocation: PlatformLocation) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scroll(0, 0);
      }
    });
  }

  onKey(event: KeyboardEvent) {
    // console.log(event);

    const element = event.target as HTMLElement;

    if (element.tagName.toUpperCase() === 'INPUT') {
      const input = (element as HTMLInputElement);
      const type = input.type.toUpperCase();
      if (type === 'TEXT' || type === 'PASSWORD') {
        return;
      }
    }

    switch (event.code) {
      case 'KeyH': // Home
        const pathnameParts = window.location.pathname
          .replace(this.platformLocation.getBaseHrefFromDOM(), '')
          .split('/');
        if (pathnameParts.length > 2 && pathnameParts[0] === 'tokens') {
          this.router.navigateByUrl(`/tokens/${pathnameParts[1]}`);
        } else {
          this.router.navigateByUrl('/');
        }
        break;
      case 'KeyN': // New Token
        this.router.navigateByUrl('/tokens/new');
        break;
      default:
        break;
    }
  }
}
