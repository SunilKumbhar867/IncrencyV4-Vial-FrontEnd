import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSettingComponent } from './area-setting.component';

describe('AreaSettingComponent', () => {
  let component: AreaSettingComponent;
  let fixture: ComponentFixture<AreaSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
