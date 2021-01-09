import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LandingService } from '../landing.service';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [
            {
              path: '',
              component: LandingComponent
            }
          ]
        )],
      declarations: [LandingComponent],
      providers: [
        { provide: LandingService, useClass: landingMockService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set mock master data using service', () => {
    spyOn(component, 'getMasterData').and.callThrough();
    component.ngOnInit();
    expect(component.getMasterData).toHaveBeenCalled();
  })
});

class landingMockService {
  getMasterData() {
    return of({
      data: [
        {
          missionName: "CCtCap Demo Mission 2", launchYear: "2020", missionIds: ["EE86F74"], imageLink: "https://images2.imgbox.com/ab/79/Wyc9K7fv_o.png", successfullLanding: true, successfullLaunch: true
        },
        {
          missionName: "CRS-20", launchYear: "2020", missionIds: ["EE86F74"], imageLink: "https://images2.imgbox.com/15/2b/NAcsTEB6_o.png", successfullLanding: true, successfullLaunch: true
        },
      ],
    });
  }
}
