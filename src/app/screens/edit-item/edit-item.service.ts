import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
import { ItemResponse } from './item-response';

@Injectable({
  providedIn: 'root'
})
export class EditItemService {

  httpOptions = { 
    headers: new HttpHeaders({
      'token': localStorage.getItem('IMToken')
    })
  }

  itemInfo: ItemResponse

  endPoint = 'http://localhost:5000/item/'

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getItem(id) {
    return this.http.get<ItemResponse>(this.endPoint + id, this.httpOptions)
  }

}
