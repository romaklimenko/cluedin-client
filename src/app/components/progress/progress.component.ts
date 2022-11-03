import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit, OnDestroy {

  seconds = 0;
  intervalId: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      this.seconds++;
      console.log('⏱️', this.seconds, 'sec.');
    }, 1000);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.intervalId);
  }

}
