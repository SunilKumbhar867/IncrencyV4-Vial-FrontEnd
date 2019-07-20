import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVernierNocalibComponent } from './view-vernier-nocalib.component';

describe('ViewVernierNocalibComponent', () => {
  let component: ViewVernierNocalibComponent;
  let fixture: ComponentFixture<ViewVernierNocalibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVernierNocalibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVernierNocalibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
