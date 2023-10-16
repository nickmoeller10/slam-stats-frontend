import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildTeamComponent } from './build-team.component';

describe('BuildTeamComponent', () => {
  let component: BuildTeamComponent;
  let fixture: ComponentFixture<BuildTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
