import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { Subject } from "rxjs";
import { HttpService } from "../../../../services/http/http.service";
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal
} from "@ng-bootstrap/ng-bootstrap";
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-webstorage";
import { RemarkComponent } from "../../../../shared/remark/remark/remark.component";
import { ErrorHandlingService } from "../../../../services/error-handling/error-handling.service";
import { DataTableDirective } from "angular-datatables";
import { Router } from "@angular/router";
import { UserService } from "../../../../services/user/user.service";
declare var swal: any;
@Component({
  selector: "app-manage-tablet",
  templateUrl: "./manage-tablet.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./manage-tablet.component.css"]
})
export class ManageTabletComponent implements AfterViewInit, OnDestroy, OnInit {
  public loading = false;
  bln_hide_detail = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dsProductData: any;
  sarr_balancewt: Array<any> = [];
  str_balance_name: string;
  dsTabletDetails: any;
  dsCoatedTabDetails: any;
  arrCheckedProduct = [];
  bln_isPopupOpened: boolean;
  isActiveProduct: boolean;
  bln_editProduct: boolean = false;
  bln_loading: boolean;
  isGranulation: string;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  IsCoated: string;
  blnShowCoatedParameters: boolean;
  blnShowGranulationParameters: boolean;
  productDetails: any;
  blnShowCompressedParameters: boolean;
  isCompressed: string;
  dsGranTabDetails: any;
  dsTabletMasterDetails: any;
  bln_showActivate: boolean;
  constructor(
    private modalService: NgbModal,
    private http: HttpService,
    private errorHandling: ErrorHandlingService,
    private dialog: MatDialog,
    private sessionStorage: SessionStorageService,
    public router?: Router,
    private userService?: UserService
  ) {
    let userRigths = this.sessionStorage.retrieve("rightsarray");
    if (userRigths.includes("Activate / Deactivate"))
    {
      this.bln_showActivate = true;
    } else
    {
      this.bln_showActivate = false;
    }
    // This service will check whether the user has right to view that page or not, If not it will redirect user to Home Page
    this.userService.checkRights("Edit Product");
    const LoggeInUSerRights = this.sessionStorage.retrieve("rightsarray");
    if (LoggeInUSerRights.find(k => k === "Edit Product") !== undefined) {
      this.bln_editProduct = true;
    } else {
      this.bln_editProduct = false;
    }
    this.loading = true;
    this.getProductDetails();
  }

  btnEdit(selectedItem: any) {
    const str_prdID = selectedItem.ProductId;
    const str_prdName = selectedItem.ProductName;
    const str_prdPV = selectedItem.ProductVersion;
    const str_prdV = selectedItem.Version;
    const nominalNomenclature = selectedItem.NominalNomenclature

    this.router.navigate(["/master/product/tablet/edit-tablet"], {
      queryParams: {
        PrdId: str_prdID,
        PrdName: str_prdName,
        PrdPV: str_prdPV,
        PrdV: str_prdV,
        nominalNomenclature:nominalNomenclature
      }
    });
  }

  getProductDetails() {
    this.http.getMethod("product/getProduct").subscribe((data: any) => {
      this.loading = false;
      // console.log(data);
      this.dsProductData = data;
      this.dsProductData = this.dsProductData.filter(k => k.ProductType == 1);
      this.rerender();
    });
  }
  selectAll(flag: any) {}
  disable() {}

  viewProduct(productinfo: any, content: any) {
    this.productDetails = productinfo;
    const ObjectData: object = {};
    const ProductID = productinfo.ProductId;
    const ProductName = productinfo.ProductName;
    const ProductVersion = productinfo.ProductVersion;
    const Version = productinfo.Version;
    this.IsCoated = productinfo.IsCoated.data[0] === 0 ? "0" : "1";
    if (this.IsCoated == "1") {
      this.blnShowCoatedParameters = true;
    } else {
      this.blnShowCoatedParameters = false;
    }
    this.isActiveProduct = productinfo.IsActive.data[0] === 0 ? false : true;
    this.isGranulation = productinfo.IsGranulation.data[0] === 0 ? "0" : "1";
    if (this.isGranulation == "1") {
      this.blnShowGranulationParameters = true;
    } else {
      this.blnShowGranulationParameters = false;
    }
    this.isCompressed = productinfo.IsCompress.data[0] === 0 ? "0" : "1";
    if (this.isCompressed == "1") {
      this.blnShowCompressedParameters = true;
    } else {
      this.blnShowCompressedParameters = false;
    }
    this.loading = true;
    Object.assign(
      ObjectData,
      { ProductId: ProductID },
      { ProductName: ProductName },
      { ProductVersion: ProductVersion},
      { Version: Version}
    );
    this.http
      .postMethod(`product/getTabletDetails`,ObjectData)
      .subscribe((data: any) => {
        this.loading = false;
        this.dsTabletMasterDetails= data.Master;
        this.dsTabletDetails = data.Compressed;
       // console.log(this.dsTabletDetails);
        this.dsCoatedTabDetails = data.Coated;
        this.dsGranTabDetails = data.Granulation;
        this.modalService.open(content, { size: "lg", centered: true });
      });
  }

  selectProduct(strProduct, blnCheckedValue) {
    console.log(strProduct);
    console.log(blnCheckedValue);

    const selectedProduct = {
      ProductID: strProduct.ProductId,
      ProductName: strProduct.ProductName,
      ProductVersion: strProduct.ProductVersion,
      Version: strProduct.Version,
    };

    if (blnCheckedValue === true) {
      this.arrCheckedProduct.push(selectedProduct);
      console.log("push data ", this.arrCheckedProduct);
    } else {
      const index = this.arrCheckedProduct.findIndex(
        prod =>
          prod.ProductID === selectedProduct.ProductID &&
          prod.ProductName === selectedProduct.ProductName &&
          prod.ProductVersion === selectedProduct.ProductVersion &&
          prod.Version === selectedProduct.Version
      );

      this.arrCheckedProduct.splice(index, 1);
      console.log("POP Data=", this.arrCheckedProduct);
    }
  }

  activateProduct(objProduct) {
    console.log(objProduct);
    swal({
      title: "Are you sure ?",
      text: "You want to Activate Product",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result => {
        if (result) {
          this.bln_isPopupOpened = true;
          const message = { message: "Product Activation" };
          this.modalService.dismissAll();
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px",
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(dresult => {
            this.bln_isPopupOpened = false;
            if (dresult !== undefined) {
              const data: Object = {};
              const userID = this.sessionStorage.retrieve("userid");
              const userName = this.sessionStorage.retrieve("username");
              const remark = dresult.reason;
              const action = "Activate Product";

              Object.assign(
                data,
                { userId: userID },
                { userName: userName },
                { remark: remark },
                { action: action },
                { productID: objProduct.ProductId },
                { productname: objProduct.ProductName },
                { productVersion: objProduct.ProductVersion },
                { Version: objProduct.Version },
                { productType: "1" }
              );

              console.log(data);
              this.bln_loading = true;
              this.http.postMethod("product/activateProduct", data).subscribe(
                (res: any) => {
                  this.bln_loading = false;
                  if (res.result == "Product Activate Successfully") {
                    swal("Product Activate Successfully", "", "success");
                    this.getProductDetails();
                  }
                },
                err => {
                  this.errorHandling.checkError(err.status);
                  this.bln_loading = false;
                }
              );
            }
          });
        }
      },
      function(dismiss) {}
    );
  }

  deactivateProduct(objProduct) {
    swal({
      title: "Are you sure ?",
      text: "You want to Deactivate Product",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(
      result => {
        if (result) {
          this.bln_isPopupOpened = true;
          const message = { message: "Product Deactivation" };
          this.modalService.dismissAll();
          const dialogRef = this.dialog.open(RemarkComponent, {
            data: message,
            width: "570px",
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(dresult => {
            this.bln_isPopupOpened = false;
            if (dresult !== undefined) {
              const data: Object = {};
              const userID = this.sessionStorage.retrieve("userid");
              const userName = this.sessionStorage.retrieve("username");
              const remark = dresult.reason;
              const action = "Deactivate Product";

              Object.assign(
                data,
                { userId: userID },
                { userName: userName },
                { remark: remark },
                { action: action },
                { productID: objProduct.ProductId },
                { productname: objProduct.ProductName },
                { productVersion: objProduct.ProductVersion },
                { Version: objProduct.Version },
                { productType: "1" }
              );

              console.log(data);
              this.bln_loading = true;
              this.http.postMethod("product/activateProduct", data).subscribe(
                (res: any) => {
                  this.bln_loading = false;
                  if (res.result == "Product Deactivate Successfully") {
                    swal("Product Deactivate Successfully", "", "success");
                    this.getProductDetails();
                  }
                },
                err => {
                  this.errorHandling.checkError(err.status);
                  this.bln_loading = false;
                }
              );
            }
          });
        }
      },
      function(dismiss) {}
    );
  }

  ngAfterViewInit(): void {
    //this.rerender();
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    if (this.dtElement.dtInstance === undefined) {
      this.dtTrigger.next();
    } else {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  ngOnInit() {
    // initialization of data tables
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
  }

  // **************************************************************************************//
}
