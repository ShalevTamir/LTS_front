import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { seperateString } from '../../common/utils/string-utils';
import { SweetAlertsService } from '../../common/services/sweet-alerts.service';
import { SweetAlertResult } from 'sweetalert2';
import { SensorHandlerService } from '../../common/services/sensor-handler.service';
import { NgIf, NgStyle } from '@angular/common';
import { DYNAMIC_SENSORS_ROUTE, TELE_PARAMS_ROUTE } from '../../app.routes';
import { DeleteSensorsService } from '../../common/services/delete-sensors.service';
import { RouterService } from '../../common/services/router-service';
import { PopupComponent } from '../../common/components/popup/popup.component';
import { UploaderComponent } from "../requirements-uploader/requirements-uploader.component";

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [NgbModule, NgIf, NgStyle, PopupComponent, UploaderComponent]
})
export class HeaderComponent implements OnInit{
handleAppearChange(event: boolean) {
  console.log('got event ' + event);
  this.showRequirementsPopup = event;
}
  @ViewChild('removeSensorBtn') removeSensorBtn!: ElementRef<HTMLElement>;
  @ViewChild(PopupComponent) popup!: PopupComponent;
  title: string = ""
  liveParamsLoaded: boolean = false;
  dynamicSensorsPageLoaded: boolean = false;
  sensorDeletionActive: boolean = false;
  showRequirementsPopup: boolean = false;
  constructor(private _router: RouterService, private _dynamicSensorService: SensorHandlerService, private _deleteSensorsService: DeleteSensorsService){
  }
  
  ngOnInit(): void {
    this._router.detectRouterEvents(RoutesRecognized).subscribe(event => {
      this.liveParamsLoaded = this._router.isCurrentUrl(event.url, TELE_PARAMS_ROUTE);
      this.dynamicSensorsPageLoaded = this._router.isCurrentUrl(event.url, DYNAMIC_SENSORS_ROUTE);
      
      if(this.dynamicSensorsPageLoaded){
        this.sensorDeletionActive = false;
      }
      let eventUrl: string = event.url;
      this.title = seperateString(eventUrl.substring(1), '-');
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
  
  handleAddSensorRequirements() {
    this.showRequirementsPopup = true;
  }
}
