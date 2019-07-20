import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import
{
  CommonModule,
  LocationStrategy,
  HashLocationStrategy
} from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { FullComponent } from "./layouts/full/full.component";
import { BlankComponent } from "./layouts/blank/blank.component";
import { NavigationComponent } from "./shared/header-navigation/navigation.component";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { BreadcrumbComponent } from "./shared/breadcrumb/breadcrumb.component";
import { NgbModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerComponent } from "./shared/spinner.component";
import { NgxWebstorageModule } from "ngx-webstorage";
import { RemarkComponent } from "./shared/remark/remark/remark.component";
import
{
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatToolbarModule
} from "@angular/material";

import { DatePipe } from "@angular/common";
import { AuthGuard } from "../app/auth.gaurd";
import { ViewProfileComponent } from "./view-profile/view-profile.component";
import { NgxLoadingModule } from "ngx-loading";
import { ChangePasswordModalComponent } from "./master/user/change-password-modal/change-password-modal.component";
import { AdminChangeProfileComponent } from "./admin-change-profile/admin-change-profile.component";
import { NgxSelectModule } from "ngx-select-ex";
import { DialogBoxComponent } from "../app/authentication/login/login.component";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';
import { ModalComponent } from './shared/modal/modal.component';
import { RemarkModalComponent } from './shared/remark-modal/remark-modal.component';
import { MessageService } from './services/PrintService/print.service';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};
const config: SocketIoConfig = { url: '192.168.1.164:9302', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    RemarkComponent,
    ViewProfileComponent,
    ChangePasswordModalComponent,
    AdminChangeProfileComponent,
    DialogBoxComponent,
    ModalComponent,
    RemarkModalComponent,
  ],
  imports: [
    NgbModalModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    NgbModule.forRoot(),
    PerfectScrollbarModule,
    AppRoutingModule,
    NgxWebstorageModule.forRoot(),
    NgxLoadingModule,
    NgxSelectModule,
    MatDialogModule,
    MatToolbarModule,
    SocketIoModule.forRoot(config),
    ToastrModule.forRoot()
  ],
  entryComponents: [
    RemarkComponent,
    ChangePasswordModalComponent,
    DialogBoxComponent,
    ModalComponent,
    RemarkModalComponent
  ],
  providers: [
    DatePipe,
    AuthGuard,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
