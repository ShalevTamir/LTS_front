import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterCardComponent } from './parameter-card.component';

describe('ParameterCardComponent', () => {
  let component: ParameterCardComponent;
  let fixture: ComponentFixture<ParameterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParameterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
