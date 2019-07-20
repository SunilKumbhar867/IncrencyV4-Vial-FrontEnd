import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Directive, ElementRef, Renderer } from '@angular/core';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})


export class FullComponent implements OnInit {

  color = 'blue';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  checkForEdit: any;
  bln_editMode: boolean;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(public router: Router, private sessionStorage: SessionStorageService, el: ElementRef, renderer: Renderer) {
    var events = 'cut copy paste keypress';

    events.split(' ').forEach(e =>
      renderer.listen(el.nativeElement, e, (event) => {
        if (e == 'cut' || e == 'copy' || e == 'paste') {
          event.preventDefault();
        }
        else if (e == 'keypress') {
          if (event.which === 32 && !event.target.value.length) {
            event.preventDefault();
          }
        }
      })
    );
  }

  ngOnInit() {
    this.sessionStorage.store('EditMode', false);
    this.checkForEdit = setInterval(() => {
      this.bln_editMode = this.sessionStorage.retrieve('EditMode');
    }, 1000);

    $(document).contextmenu(function () {
      return false;
    });

    $(document).keydown(function (e) {
      if (e.keyCode == 9) {  //tab pressed
        e.preventDefault(); // stops its action
    }
    });
  }

}
