import {Component} from '@angular/core';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public passwordVisible = false;
  public password = '';
  public username = '';
  public hasError = false;
}
