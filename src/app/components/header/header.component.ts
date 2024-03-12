import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { seperateString } from '../../common/utils/string-utils';
import { SweetAlertsService } from '../../common/services/sweet-alerts.service';
import { SweetAlertResult } from 'sweetalert2';
import { SensorHandlerService } from '../../common/services/sensor-handler.service';
import { NgIf, NgStyle } from '@angular/common';
import { DYNAMIC_SENSORS_ROUTE, TELE_PARAMS_ROUTE } from '../../app.routes';
import { DeleteSensorsService } from '../../common/services/delete-sensors.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule, NgIf, NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('removeSensorBtn') removeSensorBtn!: ElementRef<HTMLElement>;
  title: string = ""
  liveParamsLoaded: boolean = false;
  dynamicSensorsPageLoaded: boolean = false;
  sensorDeletionActive: boolean = false;
  constructor(protected router: Router, private _dynamicSensorService: SensorHandlerService, private _deleteSensorsService: DeleteSensorsService){
    this.router.events.subscribe((event: any) =>{
      if(event instanceof RoutesRecognized){
        this.liveParamsLoaded = event.url === "/" + TELE_PARAMS_ROUTE;
        this.dynamicSensorsPageLoaded = event.url === "/" + DYNAMIC_SENSORS_ROUTE;
        if(this.dynamicSensorsPageLoaded){
          this.sensorDeletionActive = false;
        }
        let eventUrl: string = event.url;
        this.title = seperateString(eventUrl.substring(1), '-');
      }
    });
  }

  handleRemoveSensors(){
    this.sensorDeletionActive = !this.sensorDeletionActive;
    this.removeSensorBtn.nativeElement.classList.add('remove-sensor-click');
    setTimeout(() => {
      this.removeSensorBtn.nativeElement.classList.remove('remove-sensor-click');
    }, 500);
    this._deleteSensorsService.notifyChange();
  }
  
  handleTrashcanMouseLeave(){
    if(this.sensorDeletionActive){
      this.removeSensorBtn.nativeElement.classList.add('active');
    }
    else{
      this.removeSensorBtn.nativeElement.classList.remove('active');
    }
  }

  async handleAddDynamicSensor(){
    this._dynamicSensorService.addDynamicSensorAsync();
  }

}
