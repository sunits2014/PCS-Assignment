import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModuleFactoryLoader } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { LandingModule } from './landing/landing.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule,
        RouterTestingModule.withRoutes(
          [
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'landing'
            },
            {
              path: 'landing',
              loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) 
            }
          ]
        ),
        LandingModule],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    router.initialNavigation();
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'PCS-Assignment'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('PCS-Assignment');
  });

  it('should load lazy loaded module', fakeAsync(() => {
    const router = TestBed.inject(Router);
    router.navigateByUrl('/landing');
    tick();
    expect(router.url).toBe('/landing');
  }));
});
