import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../app.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../auth.service";
import {map, shareReplay} from "rxjs/operators";

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

  public host$;

  constructor(private appService: AppService, private route: ActivatedRoute, private authService: AuthService) {
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

      this.host$ = this.appService.getUser(this.space.host_id).pipe(
        shareReplay(),
        map((host) => ({...host, birth: new Date(host.dob)}))
      );
    });
  }

  ngOnDestroy(): void {
  }

  reserve() {
    if (this.authService.isLoggedIn()) {
      this.appService.reserve().subscribe((res) => {
        console.log('rizrv', res);
      });
    } else {
      this.authService.openLoginModal().subscribe(res => {
        if (res) {
          this.appService.reserve().subscribe((res) => {
            console.log('rizrv', res);
          });
        }
      })
    }

  }

  disableDate(currentDate: Date) {
    return currentDate.getTime() <= new Date().getTime();
  }

  onDateOk(result: Date) {
    console.log(result);
  }


  getTotalPrice() {
    const hours = Math.abs(this.dateRange[0] - this.dateRange[1]) / 36e5;
    return Math.round((hours * this.space.price) * 100) / 100 + '€';
  }
}
