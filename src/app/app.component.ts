import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NavigationStart, Router, RouterOutlet, RoutesRecognized } from '@angular/router';
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
import { LOGIN_ROUTE, SIGNUP_ROUTE } from './app.routes';

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
    HttpClientModule,
    NgIf
  ],
  providers:[
    LiveParametersSocketService,
    SensorAlertsService,
    ParametersConfigService,
    GaugesDataPersistenceService,
    SweetAlertsService,
    SensorHandlerService,
    mongoDBHandlerService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title = 'LTS_front';
  hideUI = false;

  constructor(router: Router){
    router.events.subscribe(event => {
      if(event instanceof RoutesRecognized){
        if(event.url === "/" + LOGIN_ROUTE || event.url === "/" + SIGNUP_ROUTE){
          this.hideUI = true;
        }
        else{
          this.hideUI = false;
        }
      }
    })
  }
}
