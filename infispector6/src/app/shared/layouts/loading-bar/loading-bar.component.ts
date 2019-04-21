import {Component} from '@angular/core';

@Component({
  selector: 'loading-bar',
  templateUrl: './loading-bar.component.html',
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
