import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../app.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit, OnDestroy {

  public dateStart;
  public dateEnd;

  constructor(private appService: AppService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.dateStart = params['dateStart'];
      this.dateEnd = params['dateEnd'];
    });
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
