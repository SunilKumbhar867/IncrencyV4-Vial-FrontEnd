import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptVernierComponent } from './rpt-vernier.component';

describe('RptVernierComponent', () => {
  let component: RptVernierComponent;
  let fixture: ComponentFixture<RptVernierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptVernierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptVernierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
