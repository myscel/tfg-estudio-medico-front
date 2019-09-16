import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompPruebasComponent } from './comp-pruebas.component';

describe('CompPruebasComponent', () => {
  let component: CompPruebasComponent;
  let fixture: ComponentFixture<CompPruebasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompPruebasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompPruebasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
