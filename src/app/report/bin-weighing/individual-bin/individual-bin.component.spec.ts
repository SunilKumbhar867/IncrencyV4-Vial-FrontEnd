import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualBinComponent } from './individual-bin.component';

describe('IndividualBinComponent', () => {
  let component: IndividualBinComponent;
  let fixture: ComponentFixture<IndividualBinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualBinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
