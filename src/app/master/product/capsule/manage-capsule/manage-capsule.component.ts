import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from "rxjs";
import { HttpService } from "../../../../services/http/http.service";
import { NgbModal, ModalDismissReasons, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MatDialog } from '@angular/material';
import { SessionStorageService } from 'ngx-webstorage';
import { RemarkComponent } from '../../../../shared/remark/remark/remark.component';
import { ErrorHandlingService } from '../../../../services/error-handling/error-handling.service';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
declare var swal: any;
@Component({
  selector: 'app-manage-capsule',
  templateUrl: './manage-capsule.component.html',
  styleUrls: ['./manage-capsule.component.css']
})
export class ManageCapsuleComponent implements OnInit {
  public loading = false;
  bln_hide_detail = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dsProductData: any;
  sarr_balancewt: Array<any> = [];
  str_balance_name: string;
  dscapsuleDetails: any;
  arrCheckedProduct = [];
  bln_isPopupOpened: boolean;
  isActiveProduct: boolean;

  bln_loading: boolean;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  constructor(private modalService: NgbModal, private http: HttpService, private errorHandling: ErrorHandlingService,
    private dialog: MatDialog,
    private sessionStorage: SessionStorageService, public router?: Router,) { }

  ngOnInit() {
    this.getProductDetails();
  }
  getProductDetails() {
    this.http.getMethod("product/getProduct").subscribe((data: any) => {
      this.loading = false;
      this.dsProductData = data;
      this.dsProductData = this.dsProductData.filter(k => k.ProductType == 2);
      this.rerender();
    });
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
  ngAfterViewInit(): void {
    //this.rerender();
    this.dtTrigger.next();
  }
  viewProduct(productinfo: any, content: any) {
    const ProductID = productinfo.ProductId;
    const ProductName = productinfo.ProductName;
    const ProductVersion = productinfo.ProductVersion;
    const Version = productinfo.Version;
    const IsCoated = productinfo.isCoated === 0 ? "0" : "1";
    this.isActiveProduct = productinfo.IsActive.data[0] === 0 ? false : true;
    this.loading = true;
    this.http
      .getMethod(
        `product/getCapsuleDetails/${ProductID}/${ProductName}/${ProductVersion}/${Version}`
      )
      .subscribe((data: any) => {
    
        this.loading = false;
        this.dscapsuleDetails = data[0];
        console.log(this.dscapsuleDetails)
        this.modalService.open(content, { size: "lg", centered: true });
      });
  }
  activateProduct(objProduct) {

    //console.log(objProduct);
    swal({
      title: 'Are you sure ?',
      text: 'You want to Activate Product',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result) {
        this.bln_isPopupOpened = true;
        const message = { message: 'Product Activation' };
        this.modalService.dismissAll();
        const dialogRef = this.dialog.open(RemarkComponent, {
          data: message,
          width: '570px',
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

            Object.assign(data, { userId: userID }, { userName: userName }, { remark: remark },
              { action: action }, { productID: objProduct.ProductId }, { productname: objProduct.ProductName },
              { productVersion: objProduct.ProductVersion }, { Version: objProduct.Version },
              { productType: '1' });

            console.log(data);
            this.bln_loading = true;
            this.http.postMethod('product/activateProduct', data).subscribe((res: any) => {
              this.bln_loading = false;
              if (res.result == 'Product Activate Successfully') {
                swal("Product Activate Successfully", "", "success");
                this.getProductDetails();
              }
            },
              err => {
                this.errorHandling.checkError(err.status);
                this.bln_loading = false;
              });
          }
        });
      }
    }, function (dismiss) { });
  }

  deactivateProduct(objProduct) {
    swal({
      title: 'Are you sure ?',
      text: 'You want to Deactivate Product',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result) {
        this.bln_isPopupOpened = true;
        const message = { message: 'Product Deactivation' };
        this.modalService.dismissAll();
        const dialogRef = this.dialog.open(RemarkComponent, {
          data: message,
          width: '570px',
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

            Object.assign(data, { userId: userID }, { userName: userName }, { remark: remark },
              { action: action }, { productID: objProduct.ProductId }, { productname: objProduct.ProductName },
              { productVersion: objProduct.ProductVersion }, { Version: objProduct.Version },
              { productType: '1' });

            console.log(data);
            this.bln_loading = true;
            this.http.postMethod('product/activateProduct', data).subscribe((res: any) => {
              this.bln_loading = false;
              if (res.result == 'Product Deactivate Successfully') {
                swal("Product Deactivate Successfully", "", "success");
                this.getProductDetails();
              }
            },
              err => {
                this.errorHandling.checkError(err.status);
                this.bln_loading = false;
              });
          }
        });
      }
    }, function (dismiss) { });
  }
  EditCapsule(product) {
    this.router.navigate(['/master/product/capsule/edit-capsule'], { queryParams: product });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    console.log('ondistroy called');
  }
}
