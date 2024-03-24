import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOGIN_ROUTE } from '../../app.routes';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../common/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  protected usernameValue: string = "";
  protected passwordValue: string = "";
  constructor(private _router: Router, private _authService: AuthService){}
  
  handleRedirect(){
    this._router.navigateByUrl(LOGIN_ROUTE);
  }
  
  async handleSignUp() {
    await this._authService.signUpAsync(this.usernameValue, this.passwordValue)
    
  }
  
}
