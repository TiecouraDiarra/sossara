import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMarkersByCriteria'
})
export class FilterMarkersPipe implements PipeTransform {
    transform(markers: any[], searchText: string, selectedRegion: string, selectedCommune: string, selectedType: string): any[] {
        // transform(markers: any[], searchText: string, selectedRegion: string, selectedCommune: string, selectedType1: string): any[] {
    // if (!markers) {
    //   return markers;
    // }
    // if (!markers || !searchText) {
    //     return markers;
    //   }

    if (!markers || (!searchText && !selectedRegion)) {
      return markers;
    }

    // Filtrer les marqueurs en fonction du st
    // searchText = searchText.toLowerCase();
    // markers = markers.filter(marker => {
    //   return marker.statut.toLowerCase().includes(searchText);
    // });

    // Filtrer les marqueurs en fonction du statut
    if (searchText) {
      searchText = searchText.toLowerCase();
      markers = markers.filter(marker => {
        return marker.statut.toLowerCase().includes(searchText);
      });
    }

     // Filtrer les marqueurs en fonction de la région
     if (selectedRegion && selectedRegion !== 'Tout') {
      markers = markers.filter(marker => {
        return marker.regions === selectedRegion;
      });
    }

     // Filtrer les marqueurs en fonction de la commune
     if (selectedCommune && selectedCommune !== 'Tout') {
      markers = markers.filter(marker => {
        return marker.communes === selectedCommune;
      });
    }

    // Filtrer les marqueurs en fonction du type
    if (selectedType && selectedType !== 'Tout') {
      markers = markers.filter(marker => {
        return marker.types === selectedType;
      });
    }


    return markers;
  }
}
