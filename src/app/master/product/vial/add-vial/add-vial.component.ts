import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationService } from '../../../../services/validations/validation.service';
import { MatDialog } from '@angular/material';
import { RemarkComponent } from '../../../../shared/remark/remark/remark.component';
import { SessionStorageService } from 'ngx-webstorage';
import { HttpService } from '../../../../services/http/http.service';
import { Router } from '@angular/router';


declare var swal: any;
@Component({
  selector: 'app-add-vial',
  templateUrl: './add-vial.component.html',
  styleUrls: ['./add-vial.component.css']
})
export class AddVialComponent implements OnInit {

  addVialForm     : FormGroup;
  obj_submitData  : any;
  str_LblBFGCode  : string = '';
  bln_Loading     : boolean;
  bln_isRemarkPopupOpened: boolean;
  arrPrdCombination : any;

  constructor(
              private fb : FormBuilder ,
              private sessionStorage?: SessionStorageService , 
              private http ?: HttpService , 
              private validation?: ValidationService,
              private dialog?: MatDialog,
              public router?: Router
              ){}

  ngOnInit() {
    this.addVialForm = this.fb.group({
      str_ProductCode : ['',Validators.compose([
            this.validation.requiredField
      ])],
      str_ProductName : ['',Validators.compose([
        this.validation.requiredField
      ])],
      str_Version : ['',Validators.compose([
        this.validation.requiredField
      ])],
      str_ManufCode : ['',Validators.compose([
        this.validation.requiredField
      ])],
      str_StdWt : ['',Validators.compose([
        this.validation.requiredField
      ])]
    })

    this.http.getMethod(`product/get`).subscribe(
      (res : any ) => {
        this.arrPrdCombination = res;
      }
    )
  }

  addVial()
  {
    var Obj_AddVial = this.addVialForm;
    // console.log(Obj_AddVial);
    
    var strPrdId = this.addVialForm.get("str_ProductCode").value;
    var strPrdName = this.addVialForm.get("str_ProductName").value;
    var strPrdVersion = this.addVialForm.get("str_Version").value;
    var strMfgCode = this.addVialForm.get("str_ManufCode").value;
    var intStdWt = this.addVialForm.get("str_StdWt").value;
    var intStdDp = this.validation.getDPValue(intStdWt);

    var arrObjProduct = this.arrPrdCombination.find(k=>k.ProductId == strPrdId);
    /**
     * Construct Object Of Product Detail
     */
    const ObjectData: object = {};
    

    if(arrObjProduct == undefined)
    {
        swal({
          title: "Are you sure ?",
          text:"Do you want to add ",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "No"
        }).then(
          result =>{
            if(result)
            {
              this.bln_Loading = false;
              this.bln_isRemarkPopupOpened = true;
              const message = { message: "Add Vial" };
              const dialogRef = this.dialog.open(RemarkComponent, {
                data: message,
                width: "570px",
                disableClose: true
              });

              dialogRef.afterClosed().subscribe(result =>{
                if(result !== undefined)
                {
                  const remark = result.reason;
                  const str_activity = "Vial Added";
                  const str_userID = this.sessionStorage.retrieve("userId");
                  const str_userName = this.sessionStorage.retrieve("userName");
                  
                  Object.assign(
                    ObjectData,
                    { ProductId: strPrdId },
                    { ProductName: strPrdName },
                    { Version: strPrdVersion},
                    { MfgCode: strMfgCode},
                    { StdWt : intStdWt},
                    { StdDp : intStdDp},
                    { UserID : str_userID},
                    { UserName : str_userName},
                    { Activity : str_activity},
                    { Remark : remark}
                  );
                  console.log(JSON.stringify(ObjectData));

                  //   this.http.postMethod(`product/addVial` , ObjectData).subscribe(
                  //   (res : any) =>{
                  //     console.log(res);
                  //   }
                  // );

                }
              })
            }

          },
          function(dismiss){}
        );

        // console.log(ObjectData);
    }
    else{
         
      if(
         (arrObjProduct.ProductName.toUpperCase() == strPrdName.toUpperCase())  && 
         (arrObjProduct.Version.toUpperCase() == strPrdVersion.toUpperCase()) &&
         (arrObjProduct.ProductVersion.toUpperCase() == strMfgCode.toUpperCase()) 
         )
      {
        swal({
          title: "Product Combination Is Already Exists",
          text: "",
          type: "error",
          allowOutsideClick: false,
          },);
      }
      else{
        
      }

    }

  }

  ViewEditUser()
  {
    this.router.navigate(["/master/product/vial/edit-vial"]);
  }
  

}
