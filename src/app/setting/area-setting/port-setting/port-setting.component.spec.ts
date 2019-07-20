import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortSettingComponent } from './port-setting.component';

describe('PortSettingComponent', () => {
  let component: PortSettingComponent;
  let fixture: ComponentFixture<PortSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
