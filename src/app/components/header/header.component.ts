import { Component, Input } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { seperateString } from '../../common/utils/string-utils';
import { SweetAlertsService } from '../../common/services/sweet-alerts.service';
import { SweetAlertResult } from 'sweetalert2';
import { SensorHandlerService } from '../../common/services/sensor-handler.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title: string = ""
  constructor(private router: Router, private _dynamicSensorService: SensorHandlerService){
    this.router.events.subscribe((event: any) =>{
      if(event instanceof RoutesRecognized){
        let eventUrl: string = event.url;
        this.title = seperateString(eventUrl.substring(1), '-');
      }
    });
  }

  async handleAddDynamicSensor(){
    this._dynamicSensorService.addDynamicSensorAsync();
  }

}
