import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'el-user-avatar',
  template: `
    <div *ngIf="isLoggedIn()">
      <nz-avatar [nzSize]="48" nz-dropdown [nzDropdownMenu]="menu" [nzText]="currentUser().toUpperCase()"></nz-avatar>
      <nz-dropdown-menu #menu="nzDropdownMenu">
        <ul nz-menu nzSelectable>
          <li nz-menu-item *ngIf="currentUser() === 'user'">My reservations</li>
          <li nz-menu-item *ngIf="currentUser() === 'host'">My listings</li>
          <li nz-menu-item (click)="logout()">Logout</li>
        </ul>
      </nz-dropdown-menu>
    </div>
    <button *ngIf="!isLoggedIn()" nz-button nzType="link" (click)="openLoginModal()"
            style="margin-left: auto;margin-right: 20px; cursor: pointer">Login
    </button>
  `,
})
export class UserAvatarComponent {

  constructor(private authService: AuthService) {
  }

  openLoginModal() {
    this.authService.openLoginModal();
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  currentUser() {
    return this.authService.currentUser;
  }

}
