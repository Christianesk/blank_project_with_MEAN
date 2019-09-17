import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [];

  constructor(public _userService: UserService) {}

  loadMenu() {
    this.menu = this._userService.menu;
  }
}
