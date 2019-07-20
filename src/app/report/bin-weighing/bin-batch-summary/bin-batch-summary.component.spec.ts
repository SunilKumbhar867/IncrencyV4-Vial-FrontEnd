import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinBatchSummaryComponent } from './bin-batch-summary.component';

describe('BinBatchSummaryComponent', () => {
  let component: BinBatchSummaryComponent;
  let fixture: ComponentFixture<BinBatchSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinBatchSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinBatchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
