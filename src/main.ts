import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { GlobalResourseService } from './app/services/global-resourse.service';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
