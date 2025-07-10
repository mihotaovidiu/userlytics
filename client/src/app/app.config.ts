/* Core */
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'
/* Misc */
import { routes } from './app.routes';

/* NgRx */
import { provideStore } from '@ngrx/store';

/* UI Framework */
import { providePrimeNG } from 'primeng/config';
import { CustomTheme } from './theme/custom-theme';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { effects, reducers } from './store';
import { authTokenInterceptor } from './shared/services/auth-token.interceptor';
import { errorInterceptor } from './shared/services/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: CustomTheme
      }
    }),
    provideStore(reducers),
    provideEffects(effects),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authTokenInterceptor, errorInterceptor])
    ),

  ]
};
