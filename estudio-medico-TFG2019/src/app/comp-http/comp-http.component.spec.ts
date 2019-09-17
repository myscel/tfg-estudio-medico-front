import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompHTTPComponent } from './comp-http.component';

describe('CompHTTPComponent', () => {
  let component: CompHTTPComponent;
  let fixture: ComponentFixture<CompHTTPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompHTTPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompHTTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
