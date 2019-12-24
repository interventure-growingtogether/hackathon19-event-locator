import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {AppService} from "../app.service";
import {shareReplay} from "rxjs/operators";

@Component({
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit, OnDestroy {
  reservations;

  constructor(private authService: AuthService, private router: Router, private appService: AppService) {
  }


  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.appService.getUserReservations(1).subscribe((reservations: any[]) => {
      this.reservations = reservations.map(r => ({
        ...r,
        space$: this.appService.getSpace(r.space_id).pipe(shareReplay())
      }));
    })
  }

  ngOnDestroy(): void {
  }


}
