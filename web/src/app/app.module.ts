import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxMapboxGLModule} from "ngx-mapbox-gl";
import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {SearchComponent} from "./search/search.component";
import {AppService} from "./app.service";
import {ReservationComponent} from "./reservation/reservation.component";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ReservationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiaXYtaGFrYXRvbiIsImEiOiJjazRpYXN5a3UxZTk0M29xcXp3aTE0OWpvIn0.BKeJvy3-DYLtPs1dqYW3OQ',
    })
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}, AppService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
