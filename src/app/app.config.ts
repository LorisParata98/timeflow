import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../environments/environments';
import { routes } from './app.routes';
import { loaderInterceptor } from './components/shared/interceptors/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loaderInterceptor])),
    MessageService,
    {
      provide: 'environment',
      useValue: environment,
    },
  ],
};
