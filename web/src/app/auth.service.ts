import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {LoginComponent} from "./login/login.component";
import {NzModalService} from "ng-zorro-antd";

@Injectable()
export class AuthService implements OnDestroy {
  currentUser;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private modalService: NzModalService) {
    this.currentUser = localStorage.getItem('usr');
  }

  login(username: string, password: string): boolean {
    if (username === 'user' && password === 'hackathon') {
      localStorage.setItem('usr', 'user');
      this.currentUser = localStorage.getItem('usr');
      return true;
    }
    if (username === 'host' && password === 'hackathon') {
      localStorage.setItem('usr', 'host');
      this.currentUser = localStorage.getItem('usr');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('usr');
    this.currentUser = null;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isLoggedIn() {
    return this.currentUser && (this.currentUser === 'user' || this.currentUser === 'host');
  }

  openLoginModal() {
    const modal = this.modalService.create({
      nzTitle: 'Please log in',
      nzContent: LoginComponent,
      nzOkText: 'Login',
      nzOnOk: (componentInstance) => {
        componentInstance.hasError = false;
        if (this.login(componentInstance.username, componentInstance.password)) {
          modal.destroy();
        } else {
          componentInstance.hasError = true;
          return false;
        }
      }
    });
  }
}
