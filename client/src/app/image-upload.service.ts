import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class ImageUploadService {

  constructor(private http: HttpClient){

  }


  public uploadImage(image: File): Observable<string | any> {
    const formData = new FormData();

    formData.append('image', image, image.name);

    return this.http.post("http://yadi.sk/d/jqptz89Imbi8Cg", formData);
  }
}
