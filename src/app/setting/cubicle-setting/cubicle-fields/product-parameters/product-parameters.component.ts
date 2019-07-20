import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DataService } from '../../../../services/commonData/data.service';
import { JsonDataService } from '../../../../services/commonData/json-data.service';
import { HttpService } from '../../../../services/http/http.service';

@Component({
  selector: 'app-product-parameters',
  templateUrl: './product-parameters.component.html',
  styleUrls: ['./product-parameters.component.css']
})
export class ProductParametersComponent implements OnInit {
  str_prdID: any;
  str_prdName: any;
  str_prdVersion: any;
  str_version: any;
  str_cubicleType: any;
  str_areaName: any;
  str_prdIDNomenclature: string;

  //Compression Parameter
  int_ind: number;
  int_grp: number;
  int_thick: number;
  int_brd: number;
  int_len: number;
  int_dia: number;
  int_hard: number;
  int_fri: number;
  int_dt: number;
  int_Lod: number;
  int_td: number;
  int_fine: number;
  int_indLayer: number;
  int_grpLayer: number;
  int_indLayer1: number;
  int_grpLayer1: number;

  //Coating Parameter
  int_ind_coat: number;
  int_grp_coat: number;
  int_thick_coat: number;
  int_brd_coat: number;
  int_len_coat: number;
  int_dia_coat: number;
  int_hard_coat: number;
  int_fri_coat: number;
  int_dt_coat: number;

  dsTabletDetails: any;

  constructor(private dialogRef: MatDialogRef<ProductParametersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private dataService?: DataService,
    private jsonService?: JsonDataService, private http?: HttpService) { }

  ngOnInit()
  {
     this.str_prdID = this.data.str1;
     this.str_prdName = this.data.str2;
     this.str_prdVersion = this.data.str3;
     this.str_version = this.data.str4;
     this.str_cubicleType = this.data.str5;
     this.str_areaName = this.data.str6;

     //get Nomenclature from database
     this.dataService.getNomenclatureDetails().then((res:any) =>{
       this.str_prdIDNomenclature = res[0].BFGCode;
     });

     this.getAllParameter();
     this.getProductDetails();
  }

  getAllParameter()
  {
    this.jsonService.getValueFromJSON().then((res:any) =>{
      //get compression parameter
        this.int_ind =  res.Tablet[3].Value;
        this.int_grp = res.Tablet[4].Value;
        this.int_thick = res.Tablet[5].Value;
        this.int_brd = res.Tablet[6].Value;
        this.int_len = res.Tablet[7].Value;
        this.int_dia = res.Tablet[8].Value;
        this.int_hard = res.Tablet[9].Value;
        this.int_dt = res.Tablet[9].Value;
        this.int_fri = res.Tablet[10].Value;
        this.int_Lod = res.Tablet[11].Value;
        this.int_td = res.Tablet[12].Value;
        this.int_fine = res.Tablet[13].Value;
        this.int_indLayer = res.Tablet[14].Value;
        this.int_indLayer1 = res.Tablet[16].Value;
        this.int_grpLayer = res.Tablet[15].Value;
        this.int_grpLayer1 = res.Tablet[17].Value;

        //Coating Parameter
        this.int_ind_coat = res.TabletCoating[0].Value;
        this.int_grp_coat = res.TabletCoating[1].Value;
        this.int_thick_coat = res.TabletCoating[2].Value;
        this.int_brd_coat = res.TabletCoating[3].Value;
        this.int_len_coat = res.TabletCoating[4].Value;
        this.int_dia_coat = res.TabletCoating[5].Value;
        this.int_hard_coat = res.TabletCoating[6].Value;
        this.int_fri_coat = res.TabletCoating[7].Value;
        this.int_dt_coat = res.TabletCoating[8].Value;
    });
  }


  getProductDetails()
  {
    const ObjectData: Object = {};
    // this.http.getMethod(`product/getTabletDetails/${this.str_prdID}/${this.str_prdName}/${this.str_prdVersion}/${this.str_version}`)
    // .subscribe((res:any)=>{
    //   (this.str_cubicleType == 'Compression') ? this.dsTabletDetails = res.Compressed : (this.str_cubicleType == 'Coating') ? this.dsTabletDetails = res.Coated : this.dsTabletDetails = res.Granulation;
    // });
    Object.assign(
      ObjectData,
      { ProductId: this.str_prdID },
      { ProductName: this.str_prdName },
      { ProductVersion: this.str_prdVersion},
      { Version: this.str_version}
    );

    this.http.postMethod(`product/getTabletDetails`,ObjectData)
    .subscribe((res:any)=>{
      if(this.str_cubicleType == "IPQC")
      {
        (this.str_areaName == 'Compression') ? this.dsTabletDetails = res.Compressed : (this.str_areaName == 'Coating') ? this.dsTabletDetails = res.Coated : this.dsTabletDetails = res.Granulation;
      }
      else
      {
        (this.str_cubicleType == 'Compression') ? this.dsTabletDetails = res.Compressed : (this.str_cubicleType == 'Coating') ? this.dsTabletDetails = res.Coated : this.dsTabletDetails = res.Granulation;
      }

    });
  }

  onClose()
  {
    this.dialogRef.close();
  }
}
