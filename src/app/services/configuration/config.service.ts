import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService
{
  constructor(public http: HttpService) { }

  /** This function is used to get data which is used to show and hide parameters */
  getJsonFileData()
  {
    return this.http.getMethod('login/developerPannel');
  }
}
