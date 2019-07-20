import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.css']
})
export class SystemSettingComponent implements OnInit {
  frmSystemSetting: FormGroup;
  constructor(private fb:FormBuilder) { }

 
  ngOnInit() {
    
    this.frmSystemSetting = this.fb.group({
      intWeight:[''],
      intVolume:['']
    });

  }

  calculateDensity()
  {
      if((this.frmSystemSetting.value.intWeight>0) && (this.frmSystemSetting.value.intVolume>0))
      {
          console.log(this.frmSystemSetting.value.intWeight/this.frmSystemSetting.value.intVolume);
      }
  }

}
