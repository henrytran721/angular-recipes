import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentPage:string = 'recipes';
  renderPage(name) {
    this.currentPage = name;
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    console.log('hello');
    this.authService.autoLogin();
  }
}
