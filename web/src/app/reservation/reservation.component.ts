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
  public dateRange;
  public spaceId;

  public space;
  public mapCenter;
  public markerCoords;

  constructor(private appService: AppService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['dateRange'] && params['dateRange'].length) {
        this.dateStart = params['dateRange'][0];
        this.dateEnd = params['dateRange'][1];
      }
      if (this.dateStart && this.dateEnd) {
        this.dateRange = [new Date(this.dateStart), new Date(this.dateEnd)];
      }
    });
    this.spaceId = this.route.snapshot.paramMap.get("spaceId");
  }

  ngOnInit(): void {
    this.appService.getSpace(this.spaceId).subscribe((res) => {
      this.space = res;
      this.mapCenter = this.space.coords.split(',').map(l => parseFloat(l)).reverse();
      this.markerCoords = this.space.coords.split(',').map(l => parseFloat(l)).reverse();
    });
  }

  ngOnDestroy(): void {
  }

  reserve() {
    this.appService.reserve().subscribe((res) => {
      console.log('rizrv', res);
    })
  }

  disableDate(currentDate: Date) {
    return currentDate.getTime() <= new Date().getTime();
  }

  onDateOk(result: Date) {
    console.log(result);
  }

}
