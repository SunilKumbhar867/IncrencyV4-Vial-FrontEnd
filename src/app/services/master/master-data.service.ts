import { Injectable } from "@angular/core";
import { HttpService } from "../http/http.service";

@Injectable({
  providedIn: "root"
})
export class MasterDataService {
  constructor(private http: HttpService) {}

  /**
   * @description Master Balance Data
   * @returns Below Funtion will Return All Balance Data
   */
  getBalanceData() {
    return this.http.getMethod("balance/getBalanceDetails");
  }

  /**
   * @description Master Vernier Data
   * @returns Below Funtion will Return All Vernier Data
   */
  getVernierData() {
    return this.http.getMethod("vernier/getVernier");
  }

   /**
   * @description Master Equipment Data
   * @returns Below Funtion will Return All Equipment Data
   */
  getEquipmentData() {
    return this.http.getMethod("otherequipment/getOtherEquipment");
  }
}
