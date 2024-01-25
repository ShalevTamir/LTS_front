import { Routes } from '@angular/router';
import { LiveParametersComponent } from './components/live-parameters/live-parameters.component';
import { ArchiveComponent } from './components/archive/archive.component';

export const routes: Routes = [
    { path: 'live-telemetry-parameters', component: LiveParametersComponent },
    { path: 'archive', component: ArchiveComponent }
];
