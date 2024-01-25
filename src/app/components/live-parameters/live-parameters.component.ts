import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { FilteredFrame } from './models/ros/filtered-frame.ros';
import { LiveParametersSocketService } from './services/live-parameters-socket.service';
import { TelemetryParameter } from './models/ros/telemetry-parameter.ros';
import { SensorAlertsSocketService } from './services/sensor-alerts-socket.service';
import { ToastrService } from 'ngx-toastr';
import { SensorAlertsService } from './services/sensor-alerts.service';
import { SensorAlertsRos } from './models/ros/sensor-alert.ros';
import { SensorState } from './models/enums/sensor-state.enum';

@Component({
  selector: 'app-live-parameters',
  standalone: true,
  imports: [CardComponent, HttpClientModule, NgFor],
  templateUrl: './live-parameters.component.html',
  styleUrl: './live-parameters.component.scss',
  providers: [LiveParametersSocketService, SensorAlertsSocketService]
})
export class LiveParametersComponent implements OnInit{
  parameters: string[];
  @ViewChildren(CardComponent) cards!: QueryList<CardComponent>;
  public title: string ="Live Telemetry Parameters";
  constructor(
    private _liveParametersSocket: LiveParametersSocketService,
    private _sensorAlerts: SensorAlertsService,
    ) {
    this.parameters = ["Altitude","Longitude","Wind_Speed"];
  }

  ngOnInit(): void {
    this._liveParametersSocket.initWebSocket(this.parameters, this.updateAllCharts);
    this._sensorAlerts.init();
  }
  


  updateAllCharts = (filteredTeleFrame: FilteredFrame) => {
    this.cards.forEach(card => {
      let cardTeleParameter: TelemetryParameter | undefined = 
        filteredTeleFrame.Parameters.find(parameter => parameter.Name == card.parameterName);
      if (cardTeleParameter !== undefined){
        let date = new Date(0);
        date.setMilliseconds(filteredTeleFrame.TimeStamp);
        card.updateChartValues(date.toLocaleTimeString(), cardTeleParameter.Value);
      }
    });
  
  }

    
}
