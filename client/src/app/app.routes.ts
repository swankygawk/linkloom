import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent},
  { path: 'dashboard', component: DashboardPageComponent },
];
