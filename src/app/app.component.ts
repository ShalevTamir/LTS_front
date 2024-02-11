import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
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
    HttpClientModule
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
}
