import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
import { ImageUploadService } from './image-upload.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { PushNotificationsService } from './push-notification.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatMenuModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSelectModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot(),
    MatAutocompleteModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
  ],
  exports: [
    BrowserModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  providers: [ChatService, ImageUploadService, PushNotificationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
