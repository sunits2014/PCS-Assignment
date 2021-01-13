import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { IFlightResponse } from '../iflight-response';
import { LandingService } from '../landing.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less'],
  providers: [LandingService]
})
export class LandingComponent implements OnInit {

  @ViewChild('launchTrue') launchTrue: any;
  @ViewChild('launchFail') launchFail: any;
  @ViewChild('landTrue') landTrue: any;
  @ViewChild('landFail') landFail: any;

  public years: Array<any>;
  public masterDataSet: Array<IFlightResponse>;
  public buttonActive: string;
  public initialDataLoad: boolean;
  public filterApplied: boolean;

  private missionDetailsCollection: Array<IFlightResponse>

  constructor(public landingService: LandingService) {
    this.years = [];
    this.masterDataSet = [];
    this.missionDetailsCollection = [];
  }

  ngOnInit(): void {
    this.initialDataLoad = true;
    this.getMasterData().then(response => {
      this.initialDataLoad = false;
    });
  }

  // Method triggered while selecting the year.
  public selectYear(year) {
    if (year.activeColor === 'primary') {
      year.activeColor = '';
      this.masterDataSet = this.missionDetailsCollection;
      this.landingService.selectedYear.next(null);
    } else {
      this.landingService.selectedYear.next(year.year);
      this.years.forEach(item => {
        item.activeColor = '';
      })
      year.activeColor = 'primary';
      if (this.validateSelectedYear(year.year)) {
        this.filterDataBasedOnYear(year.year).then(response => {
          if (this.launchFail.isActive) {
            this.masterDataSet = this.masterDataSet.filter(item => {
              return !item.successfullLaunch;
            })
          } else if (this.landFail.isActive) {
            this.masterDataSet = this.masterDataSet.filter(item => {
              return !item.successfullLanding;
            })
          } else if (this.launchFail.isActive && this.landFail.isActive) {
            this.masterDataSet = this.masterDataSet.filter(item => {
              return !item.successfullLanding && !item.successfullLaunch;
            })
          }
        });
      }
    }
  }

  // Launch Specific Data
  public launchSuccessful() {
    this.launchTrue.isActive = !this.launchTrue.isActive;
    this.launchFail.isActive = false;
    this.filterApplied = true;
    if (this.launchTrue.isActive && this.landTrue.isActive) {
      this.getLaunchLandTrueData().then(response => {
        this.masterDataSet = this.masterDataSet.filter(item => {
          return item.successfullLaunch && item.successfullLanding;
        })
      })
    } else if (this.launchTrue.isActive) {
      this.getLaunchTrueData().then(response => {
        if (this.landingService.selectedYear.value) {
          this.filterDataBasedOnYear(this.landingService.selectedYear.value);
        } else {
          this.masterDataSet = [];
          this.masterDataSet = this.missionDetailsCollection;
        }
        this.filterApplied = false;
      })
    } else {
      this.getMasterData();
    }
  }

  public launchFailed() {
    this.launchTrue.isActive = false;
    this.launchFail.isActive = !this.launchFail.isActive;
    this.filterApplied = true;
    this.getMasterData().then(response => {
      if (this.launchFail.isActive) {
        this.masterDataSet = this.masterDataSet.filter(item => {
          return !item.successfullLaunch;
        })
      } else {
        this.getMasterData();
      }
    });
  }

  private getLaunchTrueData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.landingService.onSuccessLaunchTrue().subscribe(data => {
        this.populateMasterData(data).then(response => {
          return resolve(true);
        });
      })
    })
  }

  public landSuccessful() {
    this.landTrue.isActive = !this.landTrue.isActive;
    this.landFail.isActive = false;
    this.filterApplied = true;
    if (this.landTrue.isActive) {
      this.getLaunchLandTrueData().then(response => {
        if (this.landingService.selectedYear.value) {
          this.filterDataBasedOnYear(this.landingService.selectedYear.value);
        } else {
          this.masterDataSet = [];
          this.masterDataSet = this.missionDetailsCollection;
        }
        this.filterApplied = false;
      })
    } else {
      this.getMasterData();
    }
  }

  public landFailed() {
    this.landTrue.isActive = false;
    this.landFail.isActive = !this.landFail.isActive;
    this.filterApplied = true;
    this.getMasterData().then(response => {
      if (this.landFail.isActive) {
        this.masterDataSet = this.masterDataSet.filter(item => {
          return !item.successfullLanding;
        })
      } else {
        this.getMasterData();
      }
    });
  }

  private getLaunchLandTrueData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.landingService.onSuccessLaunchAndLandTrue().subscribe(data => {
        this.populateMasterData(data).then(response => {
          return resolve(true);
        });
      })
    })
  }

  // Basically main method to fetch non-filtered data.
  public getMasterData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.landingService.getMasterData().subscribe(response => {
        this.populateMasterData(response, this.landingService.selectedYear.value).then(response => {
          this.filterApplied = false;
          return resolve(true);
        });
      });
    })

  }


  // Basically an abstracted method to avoid repetetion of same logic in the above methods. Please refer to the call signatures of this method.
  private populateMasterData(response: any, selectedYear?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let launchYears = [];
      this.masterDataSet = [];
      this.missionDetailsCollection = [];
      this.years = [];
      let set = new Set();
      response.forEach(item => {
        const responseObj = this.landingService.assignTemplateValues(item);
        launchYears.push({ year: responseObj.launchYear });
        this.missionDetailsCollection.push(responseObj);
      });
      if (this.landingService.originalYearsData.value.length === 0) {
        launchYears.forEach(item => {
          if (!set.has(item.year)) {
            set.add(item.year);
            this.years.push(item);
          }
        });
        this.landingService.originalYearsData.next(this.years);
      } else {
        this.years = this.landingService.originalYearsData.value;
      }
      this.masterDataSet = this.missionDetailsCollection;
      if (selectedYear) {
        this.filterDataBasedOnYear(selectedYear).then(response => {
          return resolve(true);
        });
      } else {
        return resolve(true);
      }
    })
  }

  private filterDataBasedOnYear(year?): Promise<any> {
    return new Promise((resolve, reject) => {
      if (year) {
        this.masterDataSet = this.missionDetailsCollection.filter(item => {
          return item.launchYear === year;
        })
      }
      return resolve(true);
    });
  }

  private validateSelectedYear(selectedYear): boolean {
    let yearAvailability: boolean;
    this.missionDetailsCollection.find(item => {
      item.launchYear === selectedYear ? yearAvailability = true : false
    });
    return yearAvailability;
  }
}
