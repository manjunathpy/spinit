import { bootstrapApplication } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from './environments/environment';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
      scope: './'
    })
  ]
}).catch(err => console.error(err)); 