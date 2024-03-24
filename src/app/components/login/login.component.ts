import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SIGNUP_ROUTE } from '../../app.routes';
import { AuthService } from '../../common/services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
//TODO: move text up, letter spacing, fonts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected authFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  protected submitted: boolean = false;

  constructor(private _router: Router, private _authService: AuthService){}

  get usernameControl(): FormControl{
    return this.authFormGroup.get('username') as FormControl;
  }

  get passwordControl(): FormControl{
    return this.authFormGroup.get('password') as FormControl;
  }
  
  handleRedirect(){
    this._router.navigateByUrl(SIGNUP_ROUTE);
  }

  handleLogin() {
    this.submitted = true;
    if(!this.authFormGroup.invalid){
      this._authService.authenticateUserAsync(
        this.usernameControl.value,
        this.passwordControl.value
        );
    }
  }
  
}
