import { Component, ElementRef, Host, HostListener, InjectionToken, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE, TELE_PARAMS_ROUTE } from './app.routes';
import { AuthService } from './common/services/auth/auth.service';
import { AuthDataFactory as AuthDataFactoryService } from './components/auth/services/auth-data-factory';
import { RouterService } from './common/services/router-service';
import { TokensHandlerService } from './common/services/auth/tokens-handler.service';
import { RequestsService } from './common/services/network/requests.service';
import { ITOKEN_HANDLER_TOKEN } from './common/interfaces/ITokenHandler.interface';
import { LiveSensorsComponent } from "./components/live-sensors/live-sensors.component";
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { transform } from 'lodash';
import { Observable, filter } from 'rxjs';
import { isNullOrUndef } from './common/utils/helper';
import { MenuStateHandler } from './common/services/menu-state-handler.service';

@Component({
    selector: 'app-root',
    standalone: true,
    providers: [
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
        MenuStateHandler,
        { provide: ITOKEN_HANDLER_TOKEN, useClass: TokensHandlerService }
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    animations: [
      trigger('menuOpenClose', [
        state('open', style({
          transform: 'translateX(0)',
          marginLeft: '10px',
          marginRight: '10px'
        })),
        state('closed', style({
          marginRight: '0',
          marginLEft: '0',
          width: '0',
          transform: 'translateX(300px)'
        })),
        transition('open <=> closed', animate('0.5s ease')),
      ]),
      trigger('mainContainerMenu', [
        state('open', style({
          paddingRight: '0'
        })),
        state('closed', style({
          paddingRight: '25px'
        })),
        transition('open <=> closed', group([
          query('@menuOpenClose', animateChild()),
          animate('0.5s ease')
        ]))
      ])
    ],
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        HeaderComponent,
        LiveParametersComponent,
        RouterOutlet,
        NgIf,
        LiveSensorsComponent
    ]
})
export class AppComponent implements OnInit{
  @ViewChild(HeaderComponent) header!: HeaderComponent;
  @ViewChild('menuTitle') menuTitle!: ElementRef<HTMLElement>;
  @ViewChild(LiveSensorsComponent) liveSensorsStates!: LiveSensorsComponent;
  title = 'LTS_front';
  hideUI = false;
  isPageNotFound: boolean = false;
  isMenuOpen: boolean = false;
  isLiveParamsLoaded: Observable<boolean>;

  constructor(private _router: RouterService, private _authService: AuthService){
    this.isLiveParamsLoaded = _router.isPageLoaded(TELE_PARAMS_ROUTE);
    this._authService.restrartTokenIntervalsAsync();
    // this.isLiveParamsLoaded.pipe(filter(Boolean)).subscribe(this.matchHeight);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.matchHeight();
    }, 1);
    window.addEventListener('resize', () => this.matchHeight());
  }

  matchHeight() {
    console.log(this.menuTitle);
    if (this.menuTitle){
      const sourceHeight = this.header.height;
      const sourceMarginBottom = this.header.marginBottom;
      this.menuTitle.nativeElement.style.height = `${sourceHeight}px`;
      this.menuTitle.nativeElement.style.marginBottom = `${sourceMarginBottom}px`
    }
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
