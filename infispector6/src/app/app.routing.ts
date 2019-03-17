import {Routes, RouterModule} from '@angular/router';
import {DruidQueryVisualizationComponent} from './druid-query-visualization/druid-query-visualization.component';
import {MainLayoutComponent} from './shared/layouts/main-layout/main-layout.component';
import {HomeComponent} from './home/home.component';

export const routes:Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'druid-query-visualization',
        component: DruidQueryVisualizationComponent,
      }
    ]
  }];



export const routing = RouterModule.forRoot(routes);
