import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  user: User;

  imageUpload: File;

  imageTemp: any;

  constructor(public _userService: UserService) {
    this.user = this._userService.user;
  }

  ngOnInit() {
  }

  save(user: User) {
    this.user.name = user.name;
    if (!this.user.google) {
      this.user.email = user.email;
    }


    this._userService.updateUser(this.user)
      .subscribe();
  }

  imageSelection(file: File) {
    if (!file) {
      this.imageUpload = null;
      return;
    }

    if (file.type.indexOf('image') < 0) {
      Swal.fire('Solo Imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imageUpload = null;
    }



    this.imageUpload = file;

    let reader = new FileReader();
    let urlImageTemp = reader.readAsDataURL(file);

    reader.onloadend = () => this.imageTemp = reader.result;
  }

  changeImage() {
    this._userService.changeImage(this.imageUpload, this.user._id);
  }

}
