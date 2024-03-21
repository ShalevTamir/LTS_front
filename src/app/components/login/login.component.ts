import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SIGNUP_ROUTE } from '../../app.routes';
//TODO: move text up, letter spacing, fonts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private _router: Router){}

  handleRedirect(){
    this._router.navigateByUrl(SIGNUP_ROUTE);
  }
}
