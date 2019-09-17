import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { URL_SERVICES } from 'src/app/config/config';

import Swal from 'sweetalert2';

import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload-file/upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: User;
  public token: string;
  public menu: any = [];

  constructor(public http: HttpClient, public router: Router, public _uploadFileService: UploadFileService) {
    this.loadStorage();
  }

  renewToken() {

    let url = URL_SERVICES + '/login/renewToken?token=' + this.token;

    return this.http.get(url)
      .pipe(
        map((resp: any) => {
          this.token = resp.token;
          localStorage.setItem('token', this.token);
          return true;
        }),
        catchError(err=>{
          this.logOut();
          Swal.fire('No se pudo renovar token', 'No fue posible renovar el token', 'error');
          throw err;
        })
      );
  }

  createUser(user: User) {
    let url = URL_SERVICES + '/user';

    return this.http.post(url, user)
      .pipe(map((resp: any) => {
        Swal.fire('Usario Creado', user.email, 'success');
        return resp.usuario;
      }),
        catchError(err => {
          Swal.fire(err.error.message, err.error.errors.errors.email.message, 'error');
          throw err;
        })
      );
  }

  loginGoogle(token: string) {
    let url = URL_SERVICES + '/login/google';

    return this.http.post(url, { token })
      .pipe(map((resp: any) => {
        this.saveStorage(resp.id, resp.token, resp.user, resp.menu);
        return true;
      }));;

  }


  logIn(user: User, rememberMe: boolean = false) {

    if (rememberMe) {
      localStorage.setItem('email', user.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICES + '/login';

    return this.http.post(url, user)
      .pipe(
        map((resp: any) => {
          this.saveStorage(resp.id, resp.token, resp.user, resp.menu);
          return true;
        }),
        catchError(err => {
          Swal.fire('Error en login', err.error.message, 'error')
          throw err;
        })
      );

  }

  loadStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.user = null;
      this.menu = [];
    }
  }


  saveStorage(id: string, token: string, user: User, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.user = user;
    this.token = token;
    this.menu = menu;
  }

  isLogged() {
    return (this.token.length > 5) ? true : false;
  }

  logOut() {
    this.user = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  updateUser(user: User) {
    let url = URL_SERVICES + "/user/" + user._id + "?token=" + this.token;

    return this.http.put(url, user)
      .pipe(map((resp: any) => {

        if (user._id === this.user._id) {
          let userDB: User = resp.user;
          this.saveStorage(userDB._id, this.token, userDB, this.menu);
        }

        Swal.fire('Usuario Actualizado', user.name, 'success');
        return true;
      }),
        catchError(err => {
          Swal.fire(err.error.message, err.error.errors.errors.email.message, 'error')
          throw err;
        })
      );
  }


  changeImage(file: File, id: string) {
    this._uploadFileService.uploadFile(file, 'users', id)
      .then((resp: any) => {
        this.user.img = resp.user.img;
        Swal.fire('Imagen actualizada', this.user.name, 'success');
        this.saveStorage(id, this.token, this.user, this.menu);
      }).catch(err => {
        console.log(err)
      });
  }

  loadUsers(from: number = 0) {

    let url = URL_SERVICES + '/user?from=' + from;

    return this.http.get(url);

  }

  searchUser(term: string) {

    let url = URL_SERVICES + '/search/collection/users/' + term;

    return this.http.get(url)
      .pipe(map((resp: any) => resp.users));
  }

  removeUser(id: string) {
    let url = URL_SERVICES + '/user/' + id + '?token=' + this.token;

    return this.http.delete(url)
      .pipe(map(() => {
        Swal.fire(
          'Usuario borrado!',
          'El usuario a sido borrado.',
          'success'
        );
        return true;
      }));;
  }


}
