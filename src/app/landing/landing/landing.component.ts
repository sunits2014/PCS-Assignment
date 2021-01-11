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

  @ViewChild('launch') launch: any;
  @ViewChild('land') land: any;

  public years: Array<any>;
  public masterDataSet: Array<IFlightResponse>;
  public buttonActive: string;
  public initialDataLoad: boolean;
  public filterApplied: boolean;

  private missionDetailsCollection: Array<IFlightResponse>

  constructor(private landingService: LandingService) {
    this.years = [];
    this.masterDataSet = [];
    this.missionDetailsCollection = [];
  }

  ngOnInit(): void {
    this.initialDataLoad = true;
    this.getMasterData();
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
        this.filterDataBasedOnYear(year.year);
      }
    }
  }

  public toggleSuccessfullLaunch(event?) {
    if (event.checked && this.land.checked) {
      this.getsuccessfullLaunchAndLandData()
    } else if (!event.checked && this.land.checked) {
      this.getsuccessfullLaunchAndLandData()
    } else if (event.checked) {
      this.getsuccessfullLaunchData()
    } else {
      this.getMasterData()
    }
  }

  public toggleSuccessfullLanding(event) {
    if (event.checked) {
      this.getsuccessfullLaunchAndLandData()
    } else if (event.checked && this.launch.checked) {
      this.getsuccessfullLaunchAndLandData()
    } else if (!event.checked && this.launch.checked) {
      this.getsuccessfullLaunchData()
    } else {
      this.getMasterData()
    }
    // event.checked ? this.getsuccessfullLaunchAndLandData() : this.getMasterData();
  }

  // Basically main method to fetch non-filtered data.
  private getMasterData() {
    this.landingService.getMasterData().subscribe(response => {
      this.populateMasterData(response, this.landingService.selectedYear.value);
      this.initialDataLoad = false;
      this.filterApplied = false;
    });
  }

  private getsuccessfullLaunchData() {
    this.filterApplied = true;
    this.landingService.onSuccessLaunchTrue().subscribe(result => {
      this.populateMasterData(result, this.landingService.selectedYear.value);
      this.filterApplied = false;
    })
  }

  private getsuccessfullLaunchAndLandData() {
    this.filterApplied = true;
    this.landingService.onSuccessLaunchAndLandTrue().subscribe(result => {
      this.populateMasterData(result, this.landingService.selectedYear.value);
      this.filterApplied = false;
    })
  }

  // Basically an abstracted method to avoid repetetion of same logic in the above methods. Please refer to the call signatures of this method.
  private populateMasterData(response: any, selectedYear?: string) {
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
    this.filterDataBasedOnYear(selectedYear);
  }

  private filterDataBasedOnYear(year?) {
    if (year) {
      this.masterDataSet = this.missionDetailsCollection.filter(item => {
        return item.launchYear === year;
      })
    }
  }

  private validateSelectedYear(selectedYear): boolean {
    let yearAvailability: boolean;
    this.missionDetailsCollection.find(item => {
      item.launchYear === selectedYear ? yearAvailability = true : false
    });
    return yearAvailability;
  }
}
