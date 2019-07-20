import { Injectable } from "@angular/core";
import { SessionStorageService } from "ngx-webstorage";
import { Router } from "@angular/router";
import { HttpService } from "../http/http.service";
import { JsonDataService } from "../commonData/json-data.service";
declare var swal;

@Injectable({
  providedIn: "root"
})

export class UserService
{
  constructor(private sessionStorage: SessionStorageService, public router: Router, public http: HttpService,
    private jsonService?: JsonDataService)
  {
  }

  // The Below funtion will store all the user details in session so it can be used throughout the Application
  storeUserDetails(userData)
  {
    const isUserLoggedIn = true;
    this.sessionStorage.store("isUserLoggedIn", isUserLoggedIn);
    this.sessionStorage.store("userId", userData.result.UserID);
    this.sessionStorage.store("userName", userData.result.UserName);
    this.sessionStorage.store("userRole", userData.result.Role);
    this.sessionStorage.store("userDepartment", userData.result.Department);
    this.sessionStorage.store("userObject", userData);
    this.sessionStorage.store("type", userData.result.Type);
    this.sessionStorage.store("userIP", userData.result.HostName);
    const specialRights = userData.result.splRights;
    const removeRights = userData.result.removeRights;
    // This below code will hold both Special Rights & User Rights
    const combinedArray = userData.result.rights.concat(specialRights);
    // The below code will remove Rights Remomved & Give us the final array from which we will populate menu
    const rightsarray = combinedArray.filter(
      item => removeRights.indexOf(item) < 0
    );
    this.sessionStorage.store("rightsArray", rightsarray);
  }

  // This will check if the user has access to specific page or not
  checkRights(right)
  {
    const rightsarray = this.sessionStorage.retrieve("rightsarray");
    if (rightsarray.includes(right))
    {
    } else
    {
      swal('Access Denied', '', 'error');
      this.router.navigate(["/home"]);
    }
  }

  // This will logout the user from the Application, clear the storage values & update to Node Server
  logOut()
  {
    const userId = this.sessionStorage.retrieve("userId");
    const data = { userId: userId };
    this.http.putMethod("login/logOut", data).toPromise().then(response =>
    {
      swal("User Logged out Successfully", "", "success");
      this.jsonService.getValueFromJSON().then((res: any) =>
      {
        let isLdap = res.Ldap[0].Value;
        if (isLdap == 1)
        {
          this.router.navigate(["authentication/login-ldap"]);
        } else
        {
          this.router.navigate(["authentication/login"]);
        }
      }).catch(err =>
      {
      });

      this.sessionStorage.clear("isUserLoggedIn");
      this.sessionStorage.clear("userId");
      this.sessionStorage.clear("userName");
      this.sessionStorage.clear("userRole");
      this.sessionStorage.clear("userObject");
      this.sessionStorage.clear("rightsarray");
      this.sessionStorage.clear("type");
      this.sessionStorage.clear("editmode");
      this.sessionStorage.clear("editmode");
      this.sessionStorage.clear("userdepartment");
    });
  }
  // This will logout the user from the Application, clear the storage values & update to Node Server
  logOutonTimeout()
  {
    const userId = this.sessionStorage.retrieve("userId");
    const data = { userId: userId };
    this.http.putMethod("login/logOut", data).toPromise().then(response =>
    {

      this.jsonService.getValueFromJSON().then((res: any) =>
      {
        let isLdap = res.Ldap[0].Value;
        if (isLdap == 1)
        {
          this.router.navigate(["authentication/login-ldap"]);
        } else
        {
          this.router.navigate(["authentication/login"]);
        }
      }).catch(err =>
      {
      });
      this.sessionStorage.clear("isUserLoggedIn");
      this.sessionStorage.clear("userId");
      this.sessionStorage.clear("userName");
      this.sessionStorage.clear("userRole");
      this.sessionStorage.clear("userObject");
      this.sessionStorage.clear("rightsarray");
      this.sessionStorage.clear("type");
      this.sessionStorage.clear("editmode");
      this.sessionStorage.clear("editmode");
      this.sessionStorage.clear("userdepartment");
    });
  }

  storeUserDetailsLdap(userData)
  {
    const isUserLoggedIn = true;
    this.sessionStorage.store("isUserLoggedIn", isUserLoggedIn);
    this.sessionStorage.store("userId", userData.result[0].UserID);
    this.sessionStorage.store("userName", userData.result[0].UserInitials);
    this.sessionStorage.store("userRole", userData.result[0].Role);
    this.sessionStorage.store("userDepartment", userData.result[0].Department);
    this.sessionStorage.store("userObject", userData.result[0]);
    this.sessionStorage.store("type", userData.result[0].Type);
    this.sessionStorage.store("userIP", userData.result[0].HostName);
    const specialRights = userData.result[2].splRights;
    const removeRights = userData.result[3].removeRights;
    // This below code will hold both Special Rights & User Rights
    const combinedArray = userData.result[1].rights.concat(specialRights);
    // The below code will remove Rights Remomved & Give us the final array from which we will populate menu
    const rightsarray = combinedArray.filter(
      item => removeRights.indexOf(item) < 0
    );
    this.sessionStorage.store("rightsArray", rightsarray);
  }

}
