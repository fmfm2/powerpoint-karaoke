import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { SlideshowComponent } from './components/slideshow/slideshow.component';


export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'slideshow', component: SlideshowComponent }
];
