import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'user'): any {

    let url = URL_SERVICES + '/img';

    if (!img) {
      return url + '/users/no-existe-imagen'
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }

    switch (tipo) {
      case 'user':
        url += '/users/' + img;
        break;
      case 'option1':
        /* Write your code here  the options*/
        break;
      case 'option2':
        /* Write your code here  the options*/
        break;

      default:
        url += '/users/no-existe-imagen'
        break;
    }

    return url;
  }

}
