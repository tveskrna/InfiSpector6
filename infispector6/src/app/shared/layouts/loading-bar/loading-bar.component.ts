import {Component} from '@angular/core';

@Component({
  selector: 'loading-bar',
  template:
            `<div id="loading-bar" class="overlay" *ngIf="visible">
              <div id="myProgress">
                <div id="myBar" [style.width.%]="widthBar">{{widthBar}}%</div>
              </div>
             </div>`,
  styleUrls: ['./loading-bar.component.css']
})

export class LoadingBarComponent {

  private visible:boolean = false;
  private progress:number = 0;
  private widthBar:number = 0;

  show() {
   this.visible = true;
  }

  hide() {
    this.visible = false;
    this.progress = 0;
    this.widthBar = 0;
  }

  increase(increase) {
    this.progress += increase;
    this.widthBar = Math.round(this.progress);
  }
}
