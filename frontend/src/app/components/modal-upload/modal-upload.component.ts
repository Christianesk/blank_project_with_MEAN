import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UploadFileService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {


  public imageUpload: File;
  public imageTemp: any;

  constructor(public _uploadFileService: UploadFileService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
  }

  closeModal() {
    this.imageTemp = null;
    this.imageUpload = null;
    this._modalUploadService.hideModal();
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

  uploadImage() {
    this._uploadFileService.uploadFile(this.imageUpload, this._modalUploadService.type, this._modalUploadService.id)
      .then(resp => {
        this._modalUploadService.notification.emit(resp);
        this.closeModal();
      }).catch(err => {
        console.log('Error en la carga...');
      });
  }

}
