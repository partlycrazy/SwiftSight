import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospital, Inventory, Supplier } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpClient) { }


  //Retrieve by hospital_id
  getHospitals(): Observable<Hospital[]>
  {
   return this.http.get<Hospital[]>(`http://54.151.176.214:3000/api/hospitals`)
  }

  getInventory(hospitalId:Number, date: String) 
  {
    return this.http.get<Inventory[]>(`http://54.151.176.214:3000/api/inventory/by_category/${hospitalId}/${date}`)
  }

  getNonICUPatients(hospitalId: Number)
  {
    return this.http.get<number[]>(`http://54.151.176.214:3000/api/patients/non_icu/${hospitalId}`)
  }

  getICUPatients(hospitalId: Number)
  {
    return this.http.get<number[]>(`http://54.151.176.214:3000/api/patients/icu/${hospitalId}`)
  }

  getSuppliers(): Observable<Supplier[]>
  {
    //return this.http.get<Supplier[]>(`http://101.100.160.114:3000/api/suppliers`);
    return this.http.get<Supplier[]>(`http://54.151.176.214:3000/api/suppliers`);
  }

  getSupplierByItemId(itemID: number): Observable<Supplier[]>  
  {
    return this.http.get<Supplier[]>(`http://54.151.176.214:3000/api/suppliers/by_product/${itemID}`)
  }

  getSupplierByCategoryId(catID: number): Observable<Supplier[]>  
  {
    return this.http.get<Supplier[]>(`http://54.151.176.214:3000/api/suppliers/by_category/${catID}`)
  }

  getChartData(hospital_id: number, days: number): Observable<any[]>
  {
    return this.http.get<any[]>(`http://192.168.1.172:3000/api/chart/${hospital_id}/7`);
  } 

}
