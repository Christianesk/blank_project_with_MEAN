import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class VerifyTokenGuard implements CanActivate {

  constructor(public _userService: UserService, public router: Router) { }

  canActivate(): Promise<boolean> | boolean {

    let token = this._userService.token;

    let payload = JSON.parse(atob(token.split('.')[1]));

    let expired = this.expired(payload.exp);

    if (expired) {
      this.router.navigate(['/login']);
      Swal.fire('Sesión Expirada', 'Tu sesión a expirado', 'warning');
      return false;
    }

    return this.verifyRenew(payload.exp);
  }


  verifyRenew(dateExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tokenExp = new Date(dateExp * 1000);
      let today = new Date();

      today.setTime(today.getTime() + (4 * 60 * 60 * 1000));

      if (tokenExp.getTime() > today.getTime()) {
        resolve(true);
      } else {
        this._userService.renewToken()
          .subscribe(() => {
            resolve(true);
          }, () => {
            reject(false);
          });
      }
    });
  }


  expired(dateExp: number) {
    let today = new Date().getTime() / 1000;

    if (dateExp < today) {
      return true;
    } else {
      return false;
    }
  }

}
