import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2'
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(public _userService: UserService, public router: Router) { }

  ngOnInit() {
    init_plugins();

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      passwordConfirm: new FormControl(null, Validators.required),
      conditions: new FormControl(false)
    }, { validators: this.compareEqualFields('password', 'passwordConfirm') });
  }


  registerUser() {
    if (this.form.invalid) {
      return;
    }

    if (!this.form.value.conditions) {
      Swal.fire('Importante', ' Debe aceptar las condiciones', 'warning');
      return;
    }

    let user = new User(
      this.form.value.name,
      this.form.value.email,
      this.form.value.password
    );

    this._userService.createUser(user)
      .subscribe(resp => this.router.navigate(['/login']));
  }

  compareEqualFields(field1: string, field2: string) {
    return (group: FormGroup) => {

      let pass1 = group.controls[field1].value;
      let pass2 = group.controls[field2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        areEquals: true
      }
    };
  };

}
