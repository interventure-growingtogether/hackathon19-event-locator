import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {AppService} from "../app.service";
import {shareReplay} from "rxjs/operators";
import {NzMessageService, NzModalService} from "ng-zorro-antd";

@Component({
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit, OnDestroy {
  reservations;

  constructor(private authService: AuthService, private router: Router, private appService: AppService, private modalService: NzModalService, private message: NzMessageService) {
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

  cancelReservation(r) {
    this.modalService.warning({
      nzTitle: 'Confirm cancelation',
      nzContent: 'Are you sure you want to cancel this reservation?.',
      nzOkText: 'Yes. Cancel it!',
      nzCancelText: 'No',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.appService.cancelReservation(r.id).subscribe(() => {
          this.message.create('success', `Reservation successfully canceled!`);
        });
      }
    });
  }

  canCancel(r) {
    return !r.canceled && new Date(r.timestamp_end).getTime() > new Date().getTime();
  }


}
