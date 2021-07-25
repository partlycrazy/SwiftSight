import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Hospital, Inventory } from './dashboard/inventory/inventory';
@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }


  //Retrieve by hospital_id
  getHospitals(): Observable<Hospital[]>
  {
   return this.http.get<Hospital[]>(`http://192.168.1.172:1500/api/hospitals`)
  }

  getInventory(hospitalId:Number, date: String) 
  {
    return this.http.get<Inventory[]>(`http://192.168.1.172:1500/api/inventory/${hospitalId}/${date}`)
  }

}
