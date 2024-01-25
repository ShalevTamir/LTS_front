import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { FilteredFrame } from './models/ros/filtered-frame.ros';
import { LiveParametersSocketService } from '../../common/utils/socket-connection/live-parameters-socket.service';
import { TelemetryParameter } from './models/ros/telemetry-parameter.ros';
import { SensorAlertsSocketService } from '../../common/utils/socket-connection/sensor-alerts-socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-live-parameters',
  standalone: true,
  imports: [CardComponent, HttpClientModule, NgFor],
  templateUrl: './live-parameters.component.html',
  styleUrl: './live-parameters.component.scss',
  providers: [LiveParametersSocketService, SensorAlertsSocketService]
})
export class LiveParametersComponent implements OnInit{
  parameters: string[]
  @ViewChildren(CardComponent) cards!: QueryList<CardComponent>
  constructor(
    private _liveParametersSocket: LiveParametersSocketService,
    private _sensorAlertsSocker: SensorAlertsSocketService,
    private toastr: ToastrService
    ) {
    this.parameters = ["Altitude","Longitude","Wind_Speed"];
  }

  ngOnInit(): void {
    this._liveParametersSocket.initWebSocket(this.parameters, this.updateAllCharts);
    this._sensorAlertsSocker.initWebSocket();
    this.toastr.info("test", undefined, {closeButton: true, progressBar: true, toastClass: 'custom-toast ngx-toastr'});
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
