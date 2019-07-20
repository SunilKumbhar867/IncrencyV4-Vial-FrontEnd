import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubicleSettingComponent } from './cubicle-setting.component';

describe('CubicleSettingComponent', () => {
  let component: CubicleSettingComponent;
  let fixture: ComponentFixture<CubicleSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubicleSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubicleSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
