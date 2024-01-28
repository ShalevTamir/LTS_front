import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { NgFor } from '@angular/common';
import { FilteredFrame } from './models/ros/filtered-frame.ros';
import { LiveParametersSocketService } from './services/live-parameters-socket.service';
import { TelemetryParameter } from './models/ros/telemetry-parameter.ros';
import { SensorAlertsService } from './services/sensor-alerts.service';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-live-parameters',
  standalone: true,
  imports: [CardComponent, NgFor],
  templateUrl: './live-parameters.component.html',
  styleUrl: './live-parameters.component.scss',
})
export class LiveParametersComponent implements OnInit, OnDestroy{
  parameters: string[];
  @ViewChildren(CardComponent) cards!: QueryList<CardComponent>;
  public title: string ="Live Telemetry Parameters";
  constructor(
    private _liveParametersSocket: LiveParametersSocketService,
    private _sensorAlerts: SensorAlertsService,
    ) {
      this.parameters = ["Altitude","Longitude","Wind_Speed"];
  }
  ngOnDestroy(): void {
    this._liveParametersSocket.stopWebSocket();
    this._sensorAlerts.stopWebSocket();
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
