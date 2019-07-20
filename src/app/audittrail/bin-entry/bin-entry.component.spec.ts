import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinEntryComponent } from './bin-entry.component';

describe('BinEntryComponent', () => {
  let component: BinEntryComponent;
  let fixture: ComponentFixture<BinEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
