import { Injectable } from "@angular/core";
declare var swal: any;
@Injectable({
  providedIn: "root"
})
export class ErrorHandlingService {

  constructor() {}

  checkError(err) {

    switch (err) {

      case 0: {
        swal("Server Down", "Please Try After Sometime", "error");
        break;
      }
      case 400: {
        swal("Bad Request", "Please Try After Sometime", "error");
        break;
      }
      case 500: {
        swal("Internal Server Error", "Please Try After Sometime", "error");
        break;
      }
      case 404: {
        swal("File Not Found", "Please Try Again", "error");
        break;
      }

    }

  }
}
