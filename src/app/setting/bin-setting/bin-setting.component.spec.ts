import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinSettingComponent } from './bin-setting.component';

describe('BinSettingComponent', () => {
  let component: BinSettingComponent;
  let fixture: ComponentFixture<BinSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
