import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  userID:String;
  userName:String;
  userRole:String
  userDepartment:String;
  userRights:Array<String>;

  constructor( private sessionStorage?: SessionStorageService) { }

  ngOnInit() {
   this.userID = this.sessionStorage.retrieve('userid');
   this.userName = this.sessionStorage.retrieve('username');
   this.userRole = this.sessionStorage.retrieve('userrole');
   this.userDepartment = this.sessionStorage.retrieve('userdepartment');
   this.userRights = this.sessionStorage.retrieve('rightsarray');
  }

}
