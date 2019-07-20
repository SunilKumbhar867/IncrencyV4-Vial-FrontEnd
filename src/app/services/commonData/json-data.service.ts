import { Injectable } from '@angular/core';
import { ConfigService } from '../configuration/config.service';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {
  sarr_getAllJson: Array<string> = [];
  objarr_JSONData: any;

  constructor(private jsonService: ConfigService) { }

 /************** Function Detail ************/
  //This function is used to get all data from JSON file.
  /************End Function Detail ***********/
    getValueFromJSON() {
    return new Promise((resolve, reject) => {
      this.jsonService.getJsonFileData().subscribe(res => {
        this.objarr_JSONData = res;
        this.sarr_getAllJson = this.objarr_JSONData;
        resolve(this.sarr_getAllJson);
      }, err => {
        reject('Error occured')
      })
    })
  }
}
