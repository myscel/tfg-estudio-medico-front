import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeInvestigatorComponent } from './home-investigator.component';

describe('HomeInvestigatorComponent', () => {
  let component: HomeInvestigatorComponent;
  let fixture: ComponentFixture<HomeInvestigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeInvestigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeInvestigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
