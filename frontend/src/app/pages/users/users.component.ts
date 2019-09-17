import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  from: number = 0;
  totalRecords: number = 0;
  loading: boolean = true;


  constructor(public _userService: UserService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.loadUsers();
    this._modalUploadService.notification.subscribe(resp => this.loadUsers());
  }

  viewModal(id: string) {
    this._modalUploadService.showModal('users', id);
  }

  loadUsers() {

    this.loading = true;

    this._userService.loadUsers(this.from)
      .subscribe((resp: any) => {
        this.totalRecords = resp.total;
        this.users = resp.users;
        this.loading = false;
      });

  }

  changeFrom(valor: number) {

    let from = this.from + valor;

    if (from >= this.totalRecords) {
      return;
    }

    if (from < 0) {
      return;
    }

    this.from += valor;
    this.loadUsers();

  }

  searchUser(term: string) {

    if (term.length <= 0) {
      this.loadUsers();
      return;
    }

    this.loading = true;

    this._userService.searchUser(term)
      .subscribe((users: User[]) => {
        this.users = users;
        this.loading = false;
      });
  }

  removeUser(user: User) {
    if (user._id === this._userService.user._id) {
      Swal.fire('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: 'Estas seguro?',
      text: 'Esta a punto de borrar a ' + user.name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then(result => {
      if (result.value) {
        this._userService.removeUser(user._id)
          .subscribe(() => {
            this.loadUsers();
          });

      }
    });
  }

  saveUser(user: User) {
    this._userService.updateUser(user).subscribe();
  }

}
