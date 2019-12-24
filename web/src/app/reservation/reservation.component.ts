import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../app.service";
import {ActivatedRoute, Router} from "@angular/router";
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
  public reviews;
  public reservationsForSpace;

  public method;
  public host$;

  constructor(private appService: AppService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {
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
    this.method = this.disableDate.bind(this);
    this.appService.getSpace(this.spaceId).subscribe((res) => {
      this.space = res;
      this.mapCenter = this.space.coords.split(',').map(l => parseFloat(l)).reverse();
      this.markerCoords = this.space.coords.split(',').map(l => parseFloat(l)).reverse();

      this.host$ = this.appService.getUser(this.space.host_id).pipe(
        shareReplay(),
        map((host) => ({...host, birth: new Date(host.dob)}))
      );
    });
    this.appService.getReviews(this.spaceId).subscribe(res => this.reviews = res);
    this.appService.getReservationsForSpace(this.spaceId).subscribe(res => this.reservationsForSpace = res);
  }

  ngOnDestroy(): void {
  }

  reserve() {
    if (this.authService.isLoggedIn()) {
      this.appService.reserve(this.dateRange[0].toISOString(), this.dateRange[1].toISOString(), this.getTotalPrice(), 1, this.spaceId)
        .subscribe((res) => {
          this.router.navigate(['/reservations']);
        });
    } else {
      this.authService.openLoginModal().subscribe(res => {
        if (res) {
          this.appService.reserve(this.dateRange[0].toISOString(), this.dateRange[1].toISOString(), this.getTotalPrice(), 1, this.spaceId)
            .subscribe((res) => {
              this.router.navigate(['/reservations']);
            });
        }
      })
    }

  }

  disableDate(currentDate: Date, partial: 'start' | 'end') {
    // if (currentDate) {
    //   if (currentDate.getTime() <= new Date().getTime()) {
    //     return true;
    //   }
    //   if (this.reservationsForSpace && this.reservationsForSpace.length) {
    //     const dates = this.reservationsForSpace.map((reservation) => ({
    //       from: new Date(reservation.timestamp_start),
    //       to: new Date(reservation.timestamp_end)
    //     }));
    //     dates.forEach((d) => {
    //       console.log(d.fron, d.to, currentDate, this.dateIsBetweenDates(d.from, d.to, currentDate));
    //       if (this.dateIsBetweenDates(d.from, d.to, currentDate)) {
    //         return true;
    //       }
    //     });
    //   }
    //   return false;
    // }
    return true;
  }

  dateIsBetweenDates(from, to, dateToCheck) {
    return (dateToCheck.getTime() <= to.getTime() && dateToCheck.getTime() >= from.getTime());
  }

  onDateOk(result: Date) {
    console.log(result);
  }


  getTotalPrice() {
    const hours = Math.abs(this.dateRange[0] - this.dateRange[1]) / 36e5;
    return Math.round((hours * this.space.price) * 100) / 100;
  }
}
