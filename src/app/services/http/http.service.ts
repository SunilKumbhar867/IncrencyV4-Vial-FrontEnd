import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpService
{
  private headers = new HttpHeaders({
    'Content-Type':'application/json; charset=utf-8',
  });

  constructor(public http: HttpClient)
  {
  }
  // ******************************************************************************************* //
  // getMethod() - function takes argument as link and passed to to a Node server                //
  // ******************************************************************************************* //
  getMethod(link)
  {
    return this.http.get('http://192.168.1.164:3000/API_V1/' + link, { headers: this.headers })
  }
  // ******************************************************************************************* //
  // postMethod() - function takes argument as link and data, passes request to a Node  server  //
  // ****************************************************************************************** //
  postMethod(link, data)
  {
    return this.http.post('http://192.168.1.164:3000/API_V1/' + link, data,{ headers: this.headers })
  }
  // ****************************************************************************************** //
  // putMethod() - function takes argument as link and data, passes request to a Node  server  //
  // ******************************************************************************************* //
  putMethod(link, data)
  {
    return this.http.put('http://192.168.1.164:3000/API_V1/' + link, data)
  }

}
