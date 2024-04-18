import { Component, Host, HostListener, InjectionToken, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NavigationStart, Router, RouterEvent, RouterOutlet, RoutesRecognized } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LiveParametersComponent } from './components/live-parameters/live-parameters.component';
import { LiveParametersSocketService } from './components/live-parameters/services/live-parameters-socket.service';
import { HttpClientModule } from '@angular/common/http';
import { SensorAlertsService } from './components/live-parameters/services/sensor-alerts.service';
import { ParametersConfigService } from './components/live-parameters/services/parameters-ranges.service';
import { GaugesDataPersistenceService } from './components/live-parameters/components/parameter-card/services/gauges-data-persistence.service';
import { SweetAlertsService } from './common/services/sweet-alerts.service';
import { SensorHandlerService } from './common/services/sensor-handler.service';
import { mongoDBHandlerService } from './components/archive/services/mongoDB-handler.service';
import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from './app.routes';
import { AuthService } from './common/services/auth/auth.service';
import { AuthDataFactory as AuthDataFactoryService } from './components/auth/services/auth-data-factory';
import { RouterService } from './common/services/router-service';
import { TokensHandlerService } from './common/services/auth/tokens-handler.service';
import { RequestsService } from './common/services/network/requests.service';
import { ITOKEN_HANDLER_TOKEN } from './common/interfaces/ITokenHandler.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    LiveParametersComponent,
    RouterOutlet,
    NgIf
  ],
  providers:[
    LiveParametersSocketService,
    SensorAlertsService,
    ParametersConfigService,
    GaugesDataPersistenceService,
    SweetAlertsService,
    SensorHandlerService,
    mongoDBHandlerService,
    AuthService,
    AuthDataFactoryService,
    RouterService,
    RequestsService,
    { provide: ITOKEN_HANDLER_TOKEN, useClass: TokensHandlerService }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'LTS_front';
  hideUI = false;
  isPageNotFound: boolean = false;

  constructor(private _router: RouterService, private _authService: AuthService){
    this._authService.restrartTokenIntervalsAsync();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent){
    this._authService.movementDetected();
  }

  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent){
    this._authService.movementDetected();
  }

  @HostListener('document:click', ['$event'])
  onMouseClick(e: MouseEvent){
    this._authService.movementDetected();
  }

  ngOnInit(): void {
    this._router.detectRouterEvents(RoutesRecognized).subscribe(event => {
      this.hideUI = this._router.isCurrentUrl(event.url, LOGIN_ROUTE, SIGNUP_ROUTE) || !this._router.isRouteRecognized(event.url);
    });
  }
}
