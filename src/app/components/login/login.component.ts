import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SIGNUP_ROUTE } from '../../app.routes';
import { AuthService } from '../../common/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
//TODO: move text up, letter spacing, fonts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected usernameValue = "";
  protected passwordValue = "";

  constructor(private _router: Router, private _authService: AuthService){}
  
  handleRedirect(){
    this._router.navigateByUrl(SIGNUP_ROUTE);
  }

  handleLogin() {
    this._authService.authenticateUserAsync(
      this.usernameValue,
      this.passwordValue
      );
  }
  
}
