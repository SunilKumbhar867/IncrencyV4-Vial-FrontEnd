import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ROUTES } from "./menu-items";
import { Router, ActivatedRoute } from "@angular/router";
import { SessionStorageService } from "ngx-webstorage";
import { JsonDataService } from '../../services/commonData/json-data.service';
declare var $: any;
@Component({
  selector: "ap-sidebar",
  templateUrl: "./sidebar.component.html"
})
export class SidebarComponent implements OnInit
{
  bln_editMode: any;
  showMenu: string = "";
  showSubMenu: string = "";
  showSubSubMenu: string = "";
  public sidebarnavItems: any[];
  checkForEdit: any;
  bln_showActivityLog: boolean;

  //this is for the open close
  addExpandClass(element: any)
  {
    if (element === this.showMenu)
    {
      this.showMenu = "0";
    } else
    {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any)
  {
    if (element === this.showSubMenu)
    {
      this.showSubMenu = "0";
    } else
    {
      this.showSubMenu = element;
    }
  }
  addActiveClass1(element: any)
  {
    if (element === this.showSubSubMenu)
    {
      this.showSubSubMenu = "0";
    } else
    {
      this.showSubSubMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private sessionStorage: SessionStorageService,
    private jsonData?: JsonDataService
  )
  {
  }

  ngOnDestroy()
  {
    clearInterval(this.checkForEdit);
  }

  bln_admin: boolean;
  bln_setAllParameters: boolean;
  bln_passwordPolicy: boolean;
  bln_master: boolean;
  bln_roles: boolean;
  bln_addRole: boolean;
  bln_editRole: boolean;
  bln_user: boolean;
  bln_addUser: boolean;
  bln_manageUser: boolean;
  bln_department: boolean;
  bln_adddepartment: boolean;
  bln_editdepartment: boolean;
  bln_calibrationBox: boolean;
  bln_AddcalibrationBox: boolean;
  bln_EditcalibrationBox: boolean;
  bln_equipments: boolean;
  bln_addEquipments: boolean;
  bln_editEquipments: boolean;
  bln_stage: boolean;
  bln_product: boolean;
  bln_addProduct: boolean;
  bln_editProduct: boolean;
  bln_settting: boolean;
  bln_areaSetting: boolean;
  bln_cubicleSetting: boolean;
  bln_AlertSetting: boolean;
  bln_BinSetting: boolean;
  bln_calibration: boolean;
  bln_preCalibration: boolean;
  bln_reCalibration: boolean;
  bln_viewAuditTrail: boolean;
  bln_reports: boolean;
  bln_test: boolean;
  bln_reportBin: boolean;
  bln_machine: boolean;
  bln_addMachine: boolean;
  bln_editMachine: boolean;
  bln_media: boolean;
  bln_isLdap: any;
  int_showHidePrdSummary: any;
  int_showHideBatchSummary: any;
  int_showHideEquipment: any;
  int_showHideBalance: any;
  int_showHideVernier: any;
  int_showHideCalibrationBox: any;
  int_showHideMedia: any;
  int_showHideBinInd: any;
  int_showHideBinSummary: any;
  int_showHideTablet: any;
  int_showHideCapsule: any;
  int_showHideVial: any;
  int_showHideVernierCalib: any;

  str_type: any;

  //Below Function will Popluate Menu
  populateMenu(userRights)
  {
    // For Admin Menu
    if (userRights.includes("Set All Parameters"))
    {
      this.bln_setAllParameters = true;
    } else
    {
      this.bln_setAllParameters = false;
    }
    if (userRights.includes("Password Policy"))
    {
      this.bln_passwordPolicy = true;
    } else
    {
      this.bln_passwordPolicy = false;
    }
    if (this.bln_setAllParameters || this.bln_passwordPolicy)
    {
      this.bln_admin = true;
    } else
    {
      this.bln_admin = false;
    }

    // For Master -> Role
    if (userRights.includes("Add Role"))
    {
      this.bln_addRole = true;
    } else
    {
      this.bln_addRole = false;
    }
    if (userRights.includes("Edit Role"))
    {
      this.bln_editRole = true;
    } else
    {
      this.bln_editRole = false;
    }

    // If Any above is Ture Show Role Menu
    if (this.bln_addRole || this.bln_editRole)
    {
      this.bln_roles = true;
    } else
    {
      this.bln_roles = false;
    }

    // For Master -> User
    if (userRights.includes("Add User"))
    {
      this.bln_addUser = true;
    } else
    {
      this.bln_addUser = false;
    }
    if (userRights.includes("Manage User") || userRights.includes("Edit User")
      || userRights.includes("Change Password"))
    {
      this.bln_manageUser = true;
    } else
    {
      this.bln_manageUser = false;
    }

    // If Any above is Ture Show User Menu
    if (this.bln_addUser || this.bln_manageUser)
    {
      this.bln_user = true;
    } else
    {
      this.bln_user = false;
    }

    // For Master -> Department
    if (userRights.includes("Add Department"))
    {
      this.bln_adddepartment = true;
    } else
    {
      this.bln_adddepartment = false;
    }
    if (userRights.includes("Edit Department"))
    {
      this.bln_editdepartment = true;
    } else
    {
      this.bln_editdepartment = false;
    }
    // If Any above is Ture Show Department
    if (this.bln_adddepartment || this.bln_editdepartment)
    {
      this.bln_department = true;
    } else
    {
      this.bln_department = false;
    }

    // For Master -> Calibration Box
    if (userRights.includes("Add Calibration Box"))
    {
      this.bln_AddcalibrationBox = true;
    } else
    {
      this.bln_AddcalibrationBox = false;
    }
    if (userRights.includes("Edit Calibration Box"))
    {
      this.bln_EditcalibrationBox = true;
    } else
    {
      this.bln_EditcalibrationBox = false;
    }
    // If Any above is Ture Show Calibration Box Menu
    if (this.bln_AddcalibrationBox || this.bln_EditcalibrationBox)
    {
      this.bln_calibrationBox = true;
    } else
    {
      this.bln_calibrationBox = false;
    }

    // For Master -> Equipment -> Balance, Vernier & Other Equipments
    if (userRights.includes("Add Instruments"))
    {
      this.bln_addEquipments = true;
    } else
    {
      this.bln_addEquipments = false;
    }
    if (userRights.includes("Edit Instruments"))
    {
      this.bln_editEquipments = true;
    } else
    {
      this.bln_editEquipments = false;
    }
    // If Any above is Ture Show Equipments Menu
    if (this.bln_addEquipments || this.bln_editEquipments)
    {
      this.bln_equipments = true;
    } else
    {
      this.bln_equipments = false;
    }

    // For Master -> Machine> Add, Edit & View
    if (userRights.includes("Add Equipment"))
    {
      this.bln_addMachine = true;
    } else
    {
      this.bln_addMachine = false;
    }
    if (userRights.includes("Edit Equipment"))
    {
      this.bln_editMachine = true;
    } else
    {
      this.bln_editMachine = false;
    }
    // If Any above is Ture Show Equipments Menu
    if (this.bln_addMachine || this.bln_editMachine)
    {
      this.bln_machine = true;
    } else
    {
      this.bln_machine = false;
    }


    // For Master -> Sage
    if (userRights.includes("Media"))
    {
      this.bln_media = true;
    } else
    {
      this.bln_media = false;
    }

    // For Master -> Sage
    if (userRights.includes("Stage"))
    {
      this.bln_stage = true;
    } else
    {
      this.bln_stage = false;
    }

    // For Master -> Product -> Tablet,Capsule
    if (userRights.includes("Add Product"))
    {
      this.bln_addProduct = true;
    } else
    {
      this.bln_addProduct = false;
    }
    if (userRights.includes("Edit Product"))
    {
      this.bln_editProduct = true;
    } else
    {
      this.bln_editProduct = false;
    }

    // If Any above is Ture Show Product Menu
    if (this.bln_addProduct || this.bln_editProduct)
    {
      this.bln_product = true;
    } else
    {
      this.bln_product = false;
    }

    // For Main Master if any child righs present
    if (
      this.bln_roles ||
      this.bln_user ||
      this.bln_department ||
      this.bln_calibrationBox ||
      this.bln_equipments ||
      this.bln_stage ||
      this.bln_product ||
      this.bln_media || this.bln_machine
    )
    {
      this.bln_master = true;
    } else
    {
      this.bln_master = false;
    }

    // For Setting Menu
    if (userRights.includes("Cubicle Setting"))
    {
      this.bln_cubicleSetting = true;
    } else
    {
      this.bln_cubicleSetting = false;
    }
    if (userRights.includes("Alert Setting"))
    {
      this.bln_AlertSetting = true;
    } else
    {
      this.bln_AlertSetting = false;
    }
    if (userRights.includes("Bin / Container Setting"))
    {
      this.bln_BinSetting = true;
    } else
    {
      this.bln_BinSetting = false;
    }
    if (userRights.includes("Area Setting"))
    {
      this.bln_areaSetting = true;
    }

    // If any above right is true show Setting Menu
    if (
      this.bln_cubicleSetting ||
      this.bln_AlertSetting ||
      this.bln_BinSetting ||
      this.bln_areaSetting
    )
    {
      this.bln_settting = true;
    } else
    {
      this.bln_settting = false;
    }

    // For Calibration Menu
    if (userRights.includes("Calibration"))
    {
      this.bln_preCalibration = true;
    } else
    {
      this.bln_preCalibration = false;
    }
    if (userRights.includes("Set Recalibration"))
    {
      this.bln_reCalibration = true;
    } else
    {
      this.bln_reCalibration = false;
    }

    // If any above right is true show Calibration Menu
    if (this.bln_preCalibration || this.bln_reCalibration)
    {
      this.bln_calibration = true;
    } else
    {
      this.bln_calibration = false;
    }

    // For View Audit Trail
    if (userRights.includes("View Audit Trail"))
    {
      this.bln_viewAuditTrail = true;
    } else
    {
      this.bln_viewAuditTrail = false;
    }

    // For Reports Menu
    if (userRights.includes("Test"))
    {
      this.bln_test = true;
    } else
    {
      this.bln_test = false;
    }

    if (userRights.includes("Add Bin") || userRights.includes("Clean Bin"))
    {
      this.bln_reportBin = true;
    } else
    {
      this.bln_reportBin = false;
    }

    // If any above right is true show Reports Menu
    if (this.bln_test || this.bln_preCalibration || this.bln_reportBin)
    {
      this.bln_reports = true;
    } else
    {
      this.bln_reports = false;
    }
    // If any above right is true show Activity Log Menu
    if (userRights.includes("View Activity Log"))
    {
      this.bln_showActivityLog = true;
    } else
    {
      this.bln_showActivityLog = false;
    }
  }
  ngOnInit()
  {
    this.str_type = this.sessionStorage.retrieve("Type");
    this.sessionStorage.store("EditMode", false);
    this.checkForEdit = setInterval(() =>
    {
      this.bln_editMode = this.sessionStorage.retrieve("EditMode");
    }, 1000);
    const userRigths = this.sessionStorage.retrieve("rightsarray");
    this.populateMenu(userRigths);
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
    $(function ()
    {
      $(".sidebartoggler").on("click", function ()
      {
        if ($("#main-wrapper").hasClass("mini-sidebar"))
        {
          $("body").trigger("resize");
          $("#main-wrapper").removeClass("mini-sidebar");
        } else
        {
          $("body").trigger("resize");
          $("#main-wrapper").addClass("mini-sidebar");
        }
      });
    });

    $(document).contextmenu(function ()
    {
      return false;
    });

    //get Developer Json Data
    this.jsonData.getValueFromJSON().then((res: any) =>
    {
      console.log(res);
      this.int_showHidePrdSummary = res.Summary[1].Value;
      this.int_showHideBatchSummary = res.Summary[0].Value;
      this.int_showHideEquipment = res.Master[4].Value;
      this.int_showHideBalance = res.Balance[6].Value;
      this.int_showHideVernier = res.Vernier[0].Value;
      this.int_showHideCalibrationBox = res.Master[5].Value;
      this.int_showHideMedia = res.Equipment[1].Value; //DT
      this.int_showHideBinInd = res.Bin[6].Value;
      this.int_showHideBinSummary = res.Bin[7].Value;
      this.int_showHideTablet = res.Product[0].Value;
      this.int_showHideCapsule = res.Product[1].Value;
      this.int_showHideVial = res.Product[2].Value;
      this.int_showHideVernierCalib = res.EquipmentCalibration[1].Value;
      this.bln_isLdap = res.Ldap[0].Value;
    });
  }
}
