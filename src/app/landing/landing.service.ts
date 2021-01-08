import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFlightResponse } from './iflight-response';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private flightRespObj: IFlightResponse;

  constructor(private httpClient: HttpClient) {
  }

  public getMasterData(): Observable<any> {
    const url = 'https://api.spaceXdata.com/v3/launches?limit=100';
    return this.httpClient.get(url);
  }

  public assignTemplateValues(templateObj: any): IFlightResponse {
    this.flightRespObj = {} as IFlightResponse;
    this.flightRespObj.details = templateObj.details;
    this.flightRespObj.launchYear = templateObj.launch_year;
    this.flightRespObj.launchSite = templateObj.launch_site;
    this.flightRespObj.missionIds = templateObj.mission_id;
    this.flightRespObj.missionName = templateObj.mission_name;
    this.flightRespObj.rocket = templateObj.rocket;
    this.flightRespObj.successfullLanding = templateObj.rocket.first_stage.cores[0].land_success || false;
    this.flightRespObj.successfullLaunch = templateObj.launch_success;
    this.flightRespObj.articleLink = templateObj.links.article_link;
    this.flightRespObj.imageLink = templateObj.links.mission_patch;
    this.flightRespObj.videoLink = templateObj.links.video_link;
    this.flightRespObj.wikipediaLink = templateObj.links.wikipedia;
    return this.flightRespObj;
  }

  public onSuccessLaunchTrue(): Observable<any> {
    const url = 'https://api.spaceXdata.com/v3/launches?limit=100&launch_success=true';
    return this.httpClient.get(url);
  }

  public onSuccessLaunchAndLandTrue(): Observable<any> {
    const url = 'https://api.spaceXdata.com/v3/launches?limit=100&launch_success=true&land_success=true';
    return this.httpClient.get(url);
  }
}
