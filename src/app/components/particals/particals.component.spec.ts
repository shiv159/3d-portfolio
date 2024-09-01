import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticalsComponent } from './particals.component';

describe('ParticalsComponent', () => {
  let component: ParticalsComponent;
  let fixture: ComponentFixture<ParticalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
