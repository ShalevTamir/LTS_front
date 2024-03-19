import { Component, EventEmitter, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ParameterCardComponent } from './components/parameter-card/parameter-card.component';
import { NgFor } from '@angular/common';
import { FilteredFrameRos } from '../../common/models/ros/filtered-frame.ros';
import { LiveParametersSocketService } from './services/live-parameters-socket.service';
import { TelemetryParameterRos } from '../../common/models/ros/telemetry-parameter.ros';
import { SensorAlertsService } from './services/sensor-alerts.service';
import { ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, GuardsCheckEnd, GuardsCheckStart, NavigationEnd, NavigationStart, ResolveEnd, ResolveStart, Router, RoutesRecognized } from '@angular/router';
import { ParametersConfigService } from './services/parameters-ranges.service';
import { ParameterData } from './models/ros/parameter-range.ros';
import { GaugesDataPersistenceService } from './components/parameter-card/services/gauges-data-persistence.service';
import { LIVE_TELE_URL } from '../../common/constants';
import { TELE_PARAMS_ROUTE } from '../../app.routes';
import { SweetAlertsService } from '../../common/services/sweet-alerts.service';

@Component({
  selector: 'app-live-parameters',
  standalone: true,
  imports: [ParameterCardComponent, NgFor],
  templateUrl: './live-parameters.component.html',
  styleUrl: './live-parameters.component.scss',
})
export class LiveParametersComponent implements OnInit{
  parameters: string[];  
  @ViewChildren(ParameterCardComponent) cards!: QueryList<ParameterCardComponent>;
  public title: string ="Live Telemetry Parameters";
  parametersNamesOptions: string[] = []
  constructor(
    private _liveParametersSocket: LiveParametersSocketService,
    private _sensorAlerts: SensorAlertsService,
    private _parametersConfigService: ParametersConfigService,
    private _gaugesDataService: GaugesDataPersistenceService,
    private _router: Router,
    private _swalService: SweetAlertsService) {      
      this.parameters = ["Altitude","Longitude","Wind_Speed"];
    }
    
    ngOnInit(): void {
      this._router.events.subscribe((event: any) =>{
        if(event instanceof NavigationEnd){
          if(event.urlAfterRedirects === "/" +TELE_PARAMS_ROUTE){
            this.startSockets();
          }
          else{
            this.stopSockets();
          }
        }
        
      })
      this._parametersConfigService.getParameterNames().then((parameterNames: string[]) => this.parametersNamesOptions = parameterNames);
      this.startSockets();
      this.configGauges(this.parameters);
  }
  
  startSockets(){
    this._liveParametersSocket.initWebSocket(this.parameters, this.updateAllCharts);
    this._sensorAlerts.init();
  }

  stopSockets(){
    this._liveParametersSocket.stopWebSocket();
    this._sensorAlerts.stopWebSocket();
  }

  handleAddParameter(parameterName: string){
    if(this.parameters.includes(parameterName)){
      this._swalService.errorAlert("Card " + parameterName + " already exists");
    }
    else{
      this.configGauges([parameterName]);
      this.parameters.push(parameterName);
    }
  }

  configGauges(parametersNames: string[]){
    this._parametersConfigService.getParamsData(parametersNames).then((parametersRanges: ParameterData[]) =>{
      parametersRanges.forEach((parameterData: ParameterData) => {
        let card = this.cards.find((card) => card.parameterName == parameterData.ParameterName);
        if (card !== undefined){
          this._gaugesDataService.saveGaugeData(
            card.parameterName,
            {minValue: +parameterData.MinValue,
            maxValue: +parameterData.MaxValue,
            units: parameterData.Units});
        }
        else{
          console.error("Couldn't find card for parameter range "+parameterData.ParameterName);
        }
      });
    });
  }

  updateAllCharts = (filteredTeleFrame: FilteredFrameRos) => {
    this.cards.forEach(card => {
      let cardTeleParameter: TelemetryParameterRos | undefined = 
        filteredTeleFrame.Parameters.find(parameter => parameter.Name == card.parameterName);
      if (cardTeleParameter !== undefined){
        let date = new Date(0);
        date.setMilliseconds(filteredTeleFrame.TimeStamp);
        card.updateChartValues(date.toLocaleTimeString(), cardTeleParameter.Value);
      }
    });
  
  }

   removeParameter(parameterName: string){
    this.parameters = this.parameters.filter((parameterNameOption) => parameterNameOption != parameterName)
   } 
}
