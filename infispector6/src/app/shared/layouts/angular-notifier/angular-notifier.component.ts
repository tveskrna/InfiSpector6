import {Component, NgZone} from '@angular/core';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'angular-notifier',
  template: '<notifier-container></notifier-container>'
})

export class AngularNotifierComponent {

  //Is possible use notifier in javascript like:
  // window['NotifierComponentRef'].zone.run(() => {
  //   window['NotifierComponentRef'].component.showNotification(type, message);
  // })

  private notifier: NotifierService;

  /**
   * Constructor
   *
   * @param {NotifierService} notifier Notifier service
   * @param {NgZone} zone provides this component out of Angular
   */
  public constructor( notifier: NotifierService, private zone:NgZone) {
    this.notifier = notifier;

    window['NotifierComponentRef'] = {
      zone: this.zone,
      component: this
    };
  }

  /**
   * Show a notification
   *
   * @param {string} type    Notification type
   * @param {string} message Notification message
   */
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  /**
   * Hide oldest notification
   */
  public hideOldestNotification(): void {
    this.notifier.hideOldest();
  }

  /**
   * Hide newest notification
   */
  public hideNewestNotification(): void {
    this.notifier.hideNewest();
  }

  /**
   * Hide all notifications at once
   */
  public hideAllNotifications(): void {
    this.notifier.hideAll();
  }

  /**
   * Show a specific notification (with a custom notification ID)
   *
   * @param {string} type    Notification type
   * @param {string} message Notification message
   * @param {string} id      Notification ID
   */
  public showSpecificNotification( type: string, message: string, id: string ): void {
    this.notifier.show( {
      id,
      message,
      type
    } );
  }

  /**
   * Hide a specific notification (by a given notification ID)
   *
   * @param {string} id Notification ID
   */
  public hideSpecificNotification( id: string ): void {
    this.notifier.hide( id );
  }
}

