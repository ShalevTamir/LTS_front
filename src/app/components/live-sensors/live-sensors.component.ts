import { Component } from '@angular/core';
import { SensorCardComponent } from "./components/sensor-card/sensor-card.component";

@Component({
    selector: 'app-live-sensors',
    standalone: true,
    templateUrl: './live-sensors.component.html',
    styleUrl: './live-sensors.component.scss',
    imports: [SensorCardComponent]
})
export class LiveSensorsComponent {

}
