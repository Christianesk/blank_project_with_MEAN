import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class SettingsService {

  settings: Settings = {
    themeUrl: "assets/css/colors/default-dark.css",
    theme: "default-dark"
  }

  constructor(@Inject(DOCUMENT) private _document) {
    this.loadSettings();
  }

  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  loadSettings() {
    if (localStorage.getItem('settings')) {
      this.settings = JSON.parse(localStorage.getItem('settings'));
      this.applyTheme(this.settings.theme);
    }else{
      this.applyTheme(this.settings.theme);
    }
  }

  applyTheme(theme: string) {

    let themeUrl = `assets/css/colors/${theme}.css`;
    this._document.getElementById('theme').setAttribute('href', themeUrl);

    this.settings.theme = theme;
    this.settings.themeUrl = themeUrl;

    this.saveSettings();
  }
}

interface Settings {
  themeUrl: string;
  theme: string;
}
