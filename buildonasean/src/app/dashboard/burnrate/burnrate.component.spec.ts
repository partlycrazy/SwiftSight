import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnrateComponent } from './burnrate.component';

describe('BurnrateComponent', () => {
  let component: BurnrateComponent;
  let fixture: ComponentFixture<BurnrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurnrateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
