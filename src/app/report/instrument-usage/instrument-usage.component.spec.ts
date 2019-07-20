import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentUsageComponent } from './instrument-usage.component';

describe('InstrumentUsageComponent', () => {
  let component: InstrumentUsageComponent;
  let fixture: ComponentFixture<InstrumentUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
