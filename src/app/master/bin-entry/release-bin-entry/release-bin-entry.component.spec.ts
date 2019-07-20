import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseBinEntryComponent } from './release-bin-entry.component';

describe('ReleaseBinEntryComponent', () => {
  let component: ReleaseBinEntryComponent;
  let fixture: ComponentFixture<ReleaseBinEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseBinEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseBinEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
