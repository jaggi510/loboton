import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchScoreComponent } from './match-score.component';

describe('MatchScoreComponent', () => {
  let component: MatchScoreComponent;
  let fixture: ComponentFixture<MatchScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
