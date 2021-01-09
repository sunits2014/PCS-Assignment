import { Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(public landingService: LandingService) {
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
    } else {
      this.years.forEach(item => {
        item.activeColor = '';
      })
      year.activeColor = 'primary';
      this.masterDataSet = this.missionDetailsCollection.filter(item => {
        return item.launchYear === year.year;
      })
    }
  }

  public toggleSuccessfullLaunch(event?) {
    this.filterApplied = true;
    event.checked ? this.getsuccessfullLaunchData() : this.getMasterData();
  }

  public toggleSuccessfullLanding(event) {
    event.checked ? this.getsuccessfullLaunchAndLandData() : this.getsuccessfullLaunchData();
  }

  // Basically main method to fetch non-filtered data.
  public getMasterData() {
    if (this.land && this.land.checked) {
      this.land.checked = false;
    }
    this.landingService.getMasterData().subscribe(response => {
      this.populateMasterData(response);
      this.initialDataLoad = false;
      this.filterApplied = false;
    });
  }

  private getsuccessfullLaunchData() {
    this.filterApplied = true;
    this.landingService.onSuccessLaunchTrue().subscribe(result => {
      this.populateMasterData(result);
      this.filterApplied = false;
    })
  }

  private getsuccessfullLaunchAndLandData() {
    this.filterApplied = true;
    this.launch.checked = true;
    this.landingService.onSuccessLaunchAndLandTrue().subscribe(result => {
      this.populateMasterData(result);
      this.filterApplied = false;
    })
  }

  // Basically an abstracted method to avoid repetetion of same logic in the above methods. Please refer to the call signatures of this method.
  private populateMasterData(response: any) {
    let launchYears = [];
    this.masterDataSet = [];
    this.missionDetailsCollection = [];
    let set = new Set();
    this.years = [];
    response.forEach(item => {
      const responseObj = this.landingService.assignTemplateValues(item);
      launchYears.unshift({ year: responseObj.launchYear });
      // Filtering and considering items with valid Mission Ids only.
      if (responseObj.missionIds.length > 0) {
        this.missionDetailsCollection.unshift(responseObj);
      }
    });
    launchYears.forEach(item => {
      if (!set.has(item.year)) {
        set.add(item.year);
        this.years.push(item);
      }
    });
    this.masterDataSet = this.missionDetailsCollection;
  }
}
