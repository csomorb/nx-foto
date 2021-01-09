import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'foto';
  currentYear = new Date().getFullYear();
  showMobilNav = false;

  constructor(public authService:AuthService){}

  showHideMobilNav(){
    this.showMobilNav = !this.showMobilNav;
  }

  logout(){
    this.authService.logout();
  }

}
