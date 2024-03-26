import { Routes } from '@angular/router';
import { LiveParametersComponent } from './components/live-parameters/live-parameters.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { LiveSensorsComponent } from './components/live-sensors/live-sensors.component';
import { UploaderComponent } from './components/requirements-uploader/requirements-uploader.component';
import { AuthComponent } from './components/auth/auth.component';

export const TELE_PARAMS_ROUTE = 'live-telemetry-parameters';
export const HOME_ROUTE = TELE_PARAMS_ROUTE;
export const DYNAMIC_SENSORS_ROUTE = 'live-telemetry-sensors';
export const LOGIN_ROUTE = 'login';
export const SIGNUP_ROUTE = 'signup';

export const routes: Routes = [
    { path: TELE_PARAMS_ROUTE, component: LiveParametersComponent },
    { path: 'archive', component: ArchiveComponent },
    { path: DYNAMIC_SENSORS_ROUTE, component: LiveSensorsComponent },
    { path: LOGIN_ROUTE, component: AuthComponent },
    { path: SIGNUP_ROUTE, component: AuthComponent },
    { path: 'upload-sensors-requirements', component: UploaderComponent}
];
