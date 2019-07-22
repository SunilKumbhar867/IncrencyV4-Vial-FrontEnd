import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorageService } from 'ngx-webstorage';
import { HttpService } from '../../../../services/http/http.service';
import { ValidationService } from '../../../../services/validations/validation.service';
import { MatDialog } from '@angular/material';
import { RemarkComponent } from '../../../../shared/remark/remark/remark.component';
declare var swal: any;
@Component({
  selector: 'app-edit-vial',
  templateUrl: './edit-vial.component.html',
  styleUrls: ['./edit-vial.component.css']
})

export class EditVialComponent implements OnInit {

  editVialForm     : FormGroup;
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
    this.editVialForm = this.fb.group({
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

  editVial()
  {
    var Obj_AddVial = this.editVialForm;
    // console.log(Obj_AddVial);
    
    var strPrdId = this.editVialForm.get("str_ProductCode").value;
    var strPrdName = this.editVialForm.get("str_ProductName").value;
    var strPrdVersion = this.editVialForm.get("str_Version").value;
    var strMfgCode = this.editVialForm.get("str_ManufCode").value;
    var intStdWt = this.editVialForm.get("str_StdWt").value;
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


  


}
