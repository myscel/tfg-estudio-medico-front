import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointmentsAdminComponent } from './edit-appointments-admin.component';

describe('EditAppointmentsAdminComponent', () => {
  let component: EditAppointmentsAdminComponent;
  let fixture: ComponentFixture<EditAppointmentsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppointmentsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppointmentsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
