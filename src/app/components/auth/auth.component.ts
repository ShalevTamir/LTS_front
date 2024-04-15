import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth/auth.service';
import { HOME_ROUTE, SIGNUP_ROUTE } from '../../app.routes';
import { AuthMode } from './models/enums/auth-mode';
import { AuthData } from './models/auth-data';
import { AuthDataFactory } from './services/auth-data-factory';
import { TOKEN_STORAGE_KEY } from '../../common/models/constants';
import { TokensHandlerService } from '../../common/services/auth/tokens-handler.service';
import { ITOKEN_HANDLER_TOKEN, ITokensHandler } from '../../common/interfaces/ITokenHandler.interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit{
  protected authFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  protected submitted: boolean = false;
  private _authData!: AuthData

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _authDataFactory: AuthDataFactory,
    @Inject(ITOKEN_HANDLER_TOKEN) private _tokensHandler: ITokensHandler){
    this._authData = _authDataFactory.createAuthData((AuthMode as any)[this._router.url.substring(1).toUpperCase()]) as AuthData;
  }

  ngOnInit(): void {
    this._tokensHandler.removeTokens();
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
      let successful: boolean = false;
      switch (this._authData.getAuthMode()){
        case AuthMode.LOGIN:
          successful = await this._authService.loginAsync(...userInput);
            break;
        case AuthMode.SIGNUP:
          successful = await this._authService.signUpAsync(...userInput);
          break;
      }
      if(successful){
        this._router.navigateByUrl(HOME_ROUTE);
      }
    }
  }
}
