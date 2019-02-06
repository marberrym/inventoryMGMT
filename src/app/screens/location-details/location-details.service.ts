import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocationDetails } from './location-details';
import { Inventory } from './inventory';

@Injectable({
  providedIn: 'root'
})
export class LocationDetailsService {

  httpOptions = { 
    headers: new HttpHeaders({
      'token': localStorage.getItem('IMToken')
    })
  } 

  endPoint = "http://localhost:5000/locations/"
  constructor(
    private http: HttpClient
  ) {}

  getLocationInfo(id) {
    return this.http.get<LocationDetails>(this.endPoint + id, this.httpOptions)
  }
}
