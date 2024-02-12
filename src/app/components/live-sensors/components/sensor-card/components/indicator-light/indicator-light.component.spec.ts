import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorLightComponent } from './indicator-light.component';

describe('IndicatorLightComponent', () => {
  let component: IndicatorLightComponent;
  let fixture: ComponentFixture<IndicatorLightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorLightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicatorLightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
