import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styles: []
})
export class GlobalSearchComponent implements OnInit {

  users: User[] = [];

  loading: boolean = true;

  constructor(public activatedRoute: ActivatedRoute, public http: HttpClient) {
    activatedRoute.params
      .subscribe(params => {
        let term = params['term'];
        this.search(term);
      });
  }

  ngOnInit() {
  }

  search(term: string) {
    this.loading = true;

    let url = URL_SERVICES + '/search/all/' + term;
    this.http.get(url)
      .subscribe((resp: any) => {
        this.users = resp.users;

        this.loading = false;
      });
  }

}
