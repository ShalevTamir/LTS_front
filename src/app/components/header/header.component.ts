import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { extractNumbers, seperateString } from '../../common/utils/string-utils';
import { SweetAlertsService } from '../../common/services/sweet-alerts.service';
import { SweetAlertResult } from 'sweetalert2';
import { SensorHandlerService } from '../../common/services/sensor-handler.service';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { DYNAMIC_SENSORS_ROUTE, TELE_PARAMS_ROUTE } from '../../app.routes';
import { DeleteSensorsService } from '../../common/services/delete-sensors.service';
import { RouterService } from '../../common/services/router-service';
import { PopupComponent } from '../../common/components/popup/popup.component';
import { UploaderComponent } from "../requirements-uploader/requirements-uploader.component";
import { Observable, Subscription } from 'rxjs';
import { LiveSensorsComponent } from "../live-sensors/live-sensors.component";

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [NgbModule, NgIf, NgStyle, PopupComponent, UploaderComponent, AsyncPipe, LiveSensorsComponent]
})
export class HeaderComponent implements OnInit, OnDestroy{
  @Input() menuOpen: boolean = false;
  @Output() menuOpenChange = new EventEmitter<boolean>();
  @ViewChild('removeSensorBtn') removeSensorBtn!: ElementRef<HTMLElement>;
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  @ViewChild(PopupComponent) popup!: PopupComponent;
  title: string = ""
  isLiveParamsLoaded!: Observable<boolean>;
  isDynamicSensorsPageLoaded: Observable<boolean>;
  sensorDeletionActive: boolean = false;
  showRequirementsPopup: boolean = false;
  showSensorsStatesPopup: boolean = false;
  routerSubscripton!: Subscription
  constructor(private _router: RouterService, private _dynamicSensorService: SensorHandlerService, private _deleteSensorsService: DeleteSensorsService){
    this.isLiveParamsLoaded = _router.isPageLoaded(TELE_PARAMS_ROUTE);
    this.isDynamicSensorsPageLoaded = _router.isPageLoaded(DYNAMIC_SENSORS_ROUTE);
  }
  
  handleSensorsMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuOpenChange.emit(this.menuOpen);
  }

  ngOnDestroy(): void {
    this.routerSubscripton.unsubscribe();
  }
  
  ngOnInit(): void {
    this.updateTitle(this._router.currentUrl);
    this.routerSubscripton = this._router.detectRouterEvents(RoutesRecognized).subscribe(event => {
      this.updateTitle(event.url);
    });
    this.isDynamicSensorsPageLoaded.subscribe(value => {
      if (value){
        this.sensorDeletionActive = false;
      }
    })
  }
  
  handleAppearChange(event: boolean) {
    this.showRequirementsPopup = event;
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
  
  handleShowSensorsStates() {
    this.showSensorsStatesPopup = true;
  }

  private updateTitle(url: string){
    this.title = seperateString(url.substring(1), '-');
  }

  get height(): number{
    return this.container.nativeElement.offsetHeight;
  }  

  get marginBottom(): number{
    let containerStyle = window.getComputedStyle(this.container.nativeElement);
    
    return extractNumbers(containerStyle.marginBottom) as number;
  }
}
