import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkModalComponent } from './remark-modal.component';

describe('RemarkModalComponent', () => {
  let component: RemarkModalComponent;
  let fixture: ComponentFixture<RemarkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemarkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
