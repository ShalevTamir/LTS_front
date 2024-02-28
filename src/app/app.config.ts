import { ApplicationConfig } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ReuseStrategy } from './common/services/reuse-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideToastr(), {
    provide: RouteReuseStrategy,
    useClass: ReuseStrategy
  }]
};
