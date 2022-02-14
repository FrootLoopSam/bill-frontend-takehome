import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      // TODO: move this to SSM Param
      apiKey: 'AIzaSyBAS8w7gAcvHwHRUHKmRrqQG7Z8FiJoyM4',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
