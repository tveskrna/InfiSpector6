import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularNotifierComponent } from './angular-notifier.component';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {FormsModule} from '@angular/forms';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 7
    },
    vertical: {
      position: 'top',
      distance: 110,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AngularNotifierComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  exports: [
    AngularNotifierComponent
  ],
})
export class AngularNotifierModule { }

