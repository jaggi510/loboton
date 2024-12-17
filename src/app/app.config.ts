import Aura from '@primeng/themes/aura';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { environment } from '../environments/environment.development';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withComponentInputBinding()),
  provideAnimationsAsync(),
  providePrimeNG({
    theme: {
      preset: Aura,
      options: { darkModeSelector: false }
    }
  }), provideFirebaseApp(() => initializeApp(environment.fireConfig)),
  provideFirestore(() => getFirestore())]
};
