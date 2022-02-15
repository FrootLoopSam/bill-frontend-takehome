import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  infoWindow = new google.maps.InfoWindow();
  latitude: number;
  longitude: number;
  map: google.maps.Map;
  title = 'Bill.com Frontend App';
  zoom: number;

  @ViewChild('map') mapElement: any;

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

      if (places.length === 0) {
        return;
      }

      // Close info windows on search
      this.infoWindow.close();

      // Clear out old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
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
        const marker = new google.maps.Marker({
          icon,
          map: this.map,
          title: place.name,
          position: place.geometry.location,
        });

        // Add event listener to marker
        marker.addListener('click', () => {
          this.openInfoWindow(marker, place.rating);
        });
        markers.push(marker);

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      // Resize view to fit results
      this.map.fitBounds(bounds);
    });
  }

  /**
   * Opens info window with label and rating when marker is clicked
   * @param marker Google map marker
   * @returns void
   */
  openInfoWindow(marker: google.maps.Marker, rating: number | undefined): void {
    // Close info window if already open
    this.infoWindow.close();

    this.infoWindow.setContent(
      `<div><span>${
        marker.getTitle() || 'Title unavailable'
      }</span></br><span>Rating: ${rating}</span></div>`
    );
    this.infoWindow.open(this.map, marker);

    // Close info window if user clicks outsice
    this.map.addListener('click', () => {
      this.infoWindow.close();
    });
  }
}
