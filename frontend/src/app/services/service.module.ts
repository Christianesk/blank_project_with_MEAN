import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//GUARDS
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';

import { SettingsService, SidebarService, SharedService, UserService,VerifyTokenGuard} from "./service.index";
import { HttpClientModule } from '@angular/common/http';
import { UploadFileService } from './upload-file/upload-file.service';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    UserService,
    LoginGuard,
    UploadFileService,
    ModalUploadService,
    AdminGuard,
    VerifyTokenGuard
  ],
})
export class ServiceModule { }
