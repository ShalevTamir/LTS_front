import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, Router, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ReuseStrategy } from './common/services/reuse-strategy.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './common/services/auth/auth-interceptor';
import { SweetAlertsService } from './common/services/sweet-alerts.service';
import { AuthService } from './common/services/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    {
      provide: RouteReuseStrategy,
      useClass: ReuseStrategy
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, deps: [AuthService]
    }
  ]
};
