import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { routes } from './app.routes';
import { UtilsService } from './services/utils.service';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { SlideshowComponent } from './components/slideshow/slideshow.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SlideshowComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: UtilsService, useClass: UtilsService },
  ],
  entryComponents: [
    LandingComponent,
    SlideshowComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
