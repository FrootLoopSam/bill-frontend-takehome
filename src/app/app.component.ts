import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  latitude: number;
  longitude: number;
  title = 'Bill.com Frontend App';
  zoom: number;

  @ViewChild('map') mapElement: any;
  map: google.maps.Map;

  // Use AfterViewInit to ensure elements are available
  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    // Set center to Bill.com Headquarters
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: 37.41883, lng: -121.97839 },
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    // Create search input
    const input = document.getElementById('search-input') as HTMLInputElement;
    const searchInput = new google.maps.places.SearchBox(input);

    // Limit search to what's in the map view
    this.map.addListener('bounds_changed', () => {
      searchInput.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    let markers: google.maps.Marker[] = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchInput.addListener('places_changed', () => {
      const places = searchInput.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        console.log('place', place);

        if (!place.geometry || !place.geometry.location) {
          console.log('Returned place contains no geometry');
          return;
        }

        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each result
        markers.push(
          new google.maps.Marker({
            icon,
            map: this.map,
            title: place.name,
            position: place.geometry.location,
          })
        );

        // Add click listener to markers
        // TODO: Open window on click to display title and rating
        markers.forEach((marker) => {
          marker.addListener('click', () => {
            console.log('working', place.name);
          });
        });

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  }
}
