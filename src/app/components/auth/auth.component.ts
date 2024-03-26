import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth/auth.service';
import { SIGNUP_ROUTE } from '../../app.routes';
import { AuthMode } from './models/enums/auth-mode';
import { AuthData } from './models/auth-data';
import { AuthDataFactory } from './services/auth-data-factory';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  protected authFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  protected submitted: boolean = false;
  private _authData!: AuthData

  constructor(private _router: Router, private _authService: AuthService, private _authDataFactory: AuthDataFactory){
    this._authData = _authDataFactory.createAuthData((AuthMode as any)[this._router.url.substring(1).toUpperCase()]) as AuthData;
  }

  get usernameControl(): FormControl{
    return this.authFormGroup.get('username') as FormControl;
  }
  
  get passwordControl(): FormControl{
    return this.authFormGroup.get('password') as FormControl;
  }
  
  get buttonText(): string{
    return this._authData.getButtonText();
  }
  
  get redirectText(): string{
    return this._authData.getRedirectText();
  }
  
  get redirectButtonText(): string{
    return this._authData.getRedirectButtonText();
  }

  handleRedirect(){
    this._authData = this._authDataFactory.createAuthData(this._authData.redirectTo());
    this._router.navigateByUrl(this._authData.getUrl());
  }

  async handleSubmitAsync() {
    this.submitted = true;
    if(!this.authFormGroup.invalid){
      const userInput: [string, string] = [this.usernameControl.value, this.passwordControl.value];
      switch (this._authData.getAuthMode()){
        case AuthMode.LOGIN:
          await this._authService.loginAsync(...userInput);
            return;
        case AuthMode.SIGNUP:
          await this._authService.signUpAsync(...userInput);
          return;
      }
    }
  }
}
