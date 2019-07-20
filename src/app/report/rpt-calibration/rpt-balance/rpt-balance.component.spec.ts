import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptBalanceComponent } from './rpt-balance.component';

describe('RptBalanceComponent', () => {
  let component: RptBalanceComponent;
  let fixture: ComponentFixture<RptBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
