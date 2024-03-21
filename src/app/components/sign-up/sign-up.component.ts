import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOGIN_ROUTE } from '../../app.routes';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  constructor(private _router: Router){}

  handleRedirect(){
    this._router.navigateByUrl(LOGIN_ROUTE);
  }
}
