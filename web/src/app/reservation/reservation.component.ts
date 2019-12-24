import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../app.service";

@Component({
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit, OnDestroy {

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  reserve() {
    this.appService.reserve().subscribe((res) => {
      console.log('rizrv', res);
    })
  }

}
