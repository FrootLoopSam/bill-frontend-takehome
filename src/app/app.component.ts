import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  latitude: number;
  longitude: number;
  title = 'Bill.com Frontend App';
  zoom: number;

  ngOnInit(): void {
    this.setLocation();
  }

  handleSearch(evt: Event): void {
    // TODO: handle search
  }

  /*
   * Set map location to Bill.com Headquarters
   */
  private setLocation(): void {
    this.latitude = 37.41883;
    this.longitude = -121.97839;
    this.zoom = 16;
  }
}
