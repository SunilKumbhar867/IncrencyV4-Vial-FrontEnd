import { Component, AfterViewInit,OnInit, OnDestroy} from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { SessionStorageService } from "ngx-webstorage";
import { UserService } from "../../services/user/user.service";
import { Router } from "@angular/router";
import { JsonDataService } from "../../services/commonData/json-data.service";

@Component({
  selector: "ap-navigation",
  templateUrl: "./navigation.component.html"
})
export class NavigationComponent implements AfterViewInit ,OnInit,OnDestroy{
  userName: string;
  bln_editMode:boolean;
  checkForEdit: any;
  bln_idAdmin:any;
  bln_isLdap:any;
  public config: PerfectScrollbarConfigInterface = {};
  roleName: any;
  constructor(
    public router: Router,
    private sessionStorage: SessionStorageService,
    private userService: UserService,
    private jsonService?: JsonDataService
  ) {
    this.userName = this.sessionStorage.retrieve("username");
    this.roleName = this.sessionStorage.retrieve("userrole");
    if(this.roleName=="Admin"){
      this.bln_idAdmin=1;
    }
    this.jsonService.getValueFromJSON().then((res: any) =>
    {
      this.bln_isLdap = res.Ldap[0].Value;
    }).catch(err =>
    {
    });
  }

  logOut() {
    this.userService.logOut();
  }

  viewProfile(){
    this.router.navigate(['view-profile']);
  }

  changeProfile(){
    this.router.navigate(['admin-change-profile']);
  }

  ngOnInit() {
    this.sessionStorage.store('EditMode', false);
    this.checkForEdit = setInterval(() => {
      this.bln_editMode = this.sessionStorage.retrieve('EditMode');
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.checkForEdit);
  }

  // This is for Notifications
  notifications: Object[] = [
    {
      round: "round-danger",
      icon: "ti-link",
      title: "Luanch Admin",
      subject: "Just see the my new admin!",
      time: "9:30 AM"
    },
    {
      round: "round-success",
      icon: "ti-calendar",
      title: "Event today",
      subject: "Just a reminder that you have event",
      time: "9:10 AM"
    },
    {
      round: "round-info",
      icon: "ti-settings",
      title: "Settings",
      subject: "You can customize this template as you want",
      time: "9:08 AM"
    },
    {
      round: "round-primary",
      icon: "ti-user",
      title: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:00 AM"
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: "assets/images/users/1.jpg",
      status: "online",
      from: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:30 AM"
    },
    {
      useravatar: "assets/images/users/2.jpg",
      status: "busy",
      from: "Sonu Nigam",
      subject: "I have sung a song! See you at",
      time: "9:10 AM"
    },
    {
      useravatar: "assets/images/users/2.jpg",
      status: "away",
      from: "Arijit Sinh",
      subject: "I am a singer!",
      time: "9:08 AM"
    },
    {
      useravatar: "assets/images/users/4.jpg",
      status: "offline",
      from: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:00 AM"
    }
  ];

  ngAfterViewInit() {
    var set = function() {
      var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
      var topOffset = 0;
      if (width < 1170) {
        $("#main-wrapper").addClass("mini-sidebar");
      } else {
        $("#main-wrapper").removeClass("mini-sidebar");
      }
    };
    $(window).ready(set);
    $(window).on("resize", set);

    $(".search-box a, .search-box .app-search .srh-btn").on(
      "click",
      function() {
        $(".app-search").toggle(200);
      }
    );

    $("body").trigger("resize");
  }
}
