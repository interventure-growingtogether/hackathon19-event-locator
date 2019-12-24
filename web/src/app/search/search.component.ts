import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../app.service";
import {shareReplay} from "rxjs/operators";

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {

  public cities$;
  public selectedCity;
  public spaces;
  public visible;
  public filters = {
    wifi: false,
    everyChairHasAComputer: false,
    toilet: false,
    projector: false,
    soundSystem: false,
    heatingAc: false,
    priceRange: [0, 1000],
    dateRange: [],
    guestsRange: [0, 10000],
    scoreRange: [0, 5],
  };
  public mapCenter;
  public selectedSpace;
  public activeSpace;

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.cities$ = this.appService.getCities().pipe(shareReplay());
  }

  ngOnDestroy(): void {
  }

  search() {
    this.appService.getSpaces({city_id: this.selectedCity.id, ...this.filters}).subscribe((res) => {
      this.spaces = res.map(r => ({...r, coords: r.coords.split(',').map(l => parseFloat(l)).reverse()}));
      this.mapCenter = this.selectedCity.coords.split(',').map(l => parseFloat(l)).reverse();
    });
  }

  openFilters(): void {
    this.visible = true;
  }

  resetFilters() {
    this.filters = {
      wifi: false,
      everyChairHasAComputer: false,
      toilet: false,
      projector: false,
      soundSystem: false,
      heatingAc: false,
      priceRange: [0, 1000],
      dateRange: [],
      guestsRange: [0, 10000],
      scoreRange: [0, 5],
    };
    this.selectedSpace = null;
    this.activeSpace = null;
  }

  closeFilters(): void {
    this.visible = false;
  }

  onDateOk(result: Date) {
    console.log(result);
  }

  disableDate(currentDate: Date) {
    return currentDate.getTime() <= new Date().getTime();
  }

  selectSpace(space) {
    this.selectedSpace = space;
    this.activeSpace = space;
  }

}
