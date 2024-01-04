import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveParametersComponent } from './live-parameters.component';

describe('LiveParametersComponent', () => {
  let component: LiveParametersComponent;
  let fixture: ComponentFixture<LiveParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveParametersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiveParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
