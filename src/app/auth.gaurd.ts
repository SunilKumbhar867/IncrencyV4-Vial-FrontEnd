import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { SessionStorageService } from 'ngx-webstorage';
import { JsonDataService } from './services/commonData/json-data.service';
declare var swal: any;
@Injectable()
export class AuthGuard implements CanActivate
{
  check: any;
  isLdap: any;
  constructor(private sessionStorage?: SessionStorageService, public router?: Router,
    private jsonService?: JsonDataService)
  {
    this.jsonService.getValueFromJSON().then((res: any) =>
    {
      this.isLdap = res.Ldap[0].Value;

    }).catch(err =>
    {
    });
  }
  // **********************************************************************************************//
  // canActivate() - can activate check if user logged in or not based on below given condition   //
  // If  isUserLoggedIn return true then it allow to enter in software otherwise control goes //
  // to login page                                                                               //
  // ************************************************************************************************//
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
  {
    this.check = this.sessionStorage.retrieve('isUserLoggedIn');
    if (this.check === true)
    {
      return true;
    } else
    {
      swal("Please Login in to continue", "", "error");
      if (this.isLdap == 1)
      {
        this.router.navigate(["authentication/login-ldap"]);
      } else
      {
        this.router.navigate(["authentication/login"]);
      }

      return false;
    }
  }
  // ************************************************************************************************//
}
