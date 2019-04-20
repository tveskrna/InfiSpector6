import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {routing} from './app.routing';

import {MainLayoutModule} from './shared/layouts/main-layout/main-layout.module';
import {DruidQueryVisualizationModule} from './druid-query-visualization/druid-query-visualization.module';
import {NavigationModule} from './shared/layouts/navigation/navigation.module';
import {HomeModule} from './home/home.module';
import {APP_ENVIRONMENT} from './environment';
import {DruidLibraryService} from './shared/tools/druid-library/druid-library.service';
import {AngularNotifierModule} from './shared/layouts/angular-notifier/angular-notifier.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    routing,

    MainLayoutModule,
    NavigationModule,
    HomeModule,
    DruidQueryVisualizationModule
  ],
  exports: [],
  providers: [
    APP_ENVIRONMENT,
    DruidLibraryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
