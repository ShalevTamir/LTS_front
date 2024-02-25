import { Routes } from '@angular/router';
import { LiveParametersComponent } from './components/live-parameters/live-parameters.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { LiveSensorsComponent } from './components/live-sensors/live-sensors.component';

export const TELE_PARAMS_ROUTE = 'live-telemetry-parameters';

export const routes: Routes = [
    { path: TELE_PARAMS_ROUTE, component: LiveParametersComponent },
    { path: 'archive', component: ArchiveComponent },
    { path: 'live-telemetry-sensors', component: LiveSensorsComponent }
];
