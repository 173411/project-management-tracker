import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchTeamComponent } from './fetch-team.component';

describe('FetchTeamComponent', () => {
  let component: FetchTeamComponent;
  let fixture: ComponentFixture<FetchTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FetchTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FetchTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
