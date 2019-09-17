import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService } from 'src/app/services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor(public _settingsService: SettingsService) { }

  ngOnInit() {
    this.placeCheck();
  }

  changeColor(theme: string, link: any) {

    this.applyCheck(link);

    this._settingsService.applyTheme(theme);
  }

  applyCheck(link: any) {

    let selectores: any = document.getElementsByClassName("selector");

    for (let ref of selectores) {
      ref.classList.remove('working');

    }

    link.classList.add('working');
  }

  placeCheck() {
    let selectores: any = document.getElementsByClassName("selector");

    let theme = this._settingsService.settings.theme;

    for (let ref of selectores) {
      if (ref.getAttribute('data-theme') === theme) {
        ref.classList.add('working');
        break;
      }
    }
  }


}
