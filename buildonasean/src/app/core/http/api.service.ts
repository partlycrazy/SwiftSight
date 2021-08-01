import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Hospital, Inventory, Shipment, Supplier } from '../../shared/interfaces';
import { catchError } from 'rxjs/operators';

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

  getHospital(hospital_id: number)
  {
    return this.http.get<any[]>(`http://54.151.176.214:3000/api/hospitals/${hospital_id}`);
  }

  getInventory(hospitalId:Number, date: String) 
  {
    return this.http.get<Inventory[]>(`http://54.151.176.214:3000/api/inventory/by_category/${hospitalId}/${date}`)
  }

  getDaysLeft(hospital_id: number)
  {
    return this.http.get<any[]>(`http://54.151.176.214:3000/api/inventory/burn/${hospital_id}`);
  }

  getNonICUPatients(hospitalId: Number)
  {
    return this.http.get<number[]>(`http://54.151.176.214:3000/api/patients/non_icu/${hospitalId}`)
  }

  getICUPatients(hospitalId: Number)
  {
    return this.http.get<number[]>(`http://54.151.176.214:3000/api/patients/icu/${hospitalId}`)
  }

  getPatientCount(hospital_id: number)
  {
    return this.http.get<number[]>(`http://54.151.176.214:3000/api/patients/count/${hospital_id}`);
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
  
  getDeliveryTime(hospital_id: number, category_id: number)
  {
    return this.http.get<any[]>(`http://54.151.176.214:3000/api/suppliers/delivery/${hospital_id}/${category_id}`);
  }

  getChartData(hospital_id: number, days: number): Observable<any[]>
  {
    return this.http.get<any[]>(`http://54.151.176.214:3000/api/chart/${hospital_id}/7`);
  } 

  getUpcomingShipments(hospital_id: number)
  {
    return this.http.get<any[]>(`http://54.151.176.214:3000/api/shipments/upcoming/${hospital_id}`);
  }

  updateShipment(shipment: Shipment)
  {
    return this.http.post<any[]>(`http://54.151.176.214:3000/api/shipments/update`, shipment)
    // .pipe(
    //   catchError(err => of([]))
    // ).subscribe(
    //   res => console.log(res),
    //   err => console.log(err),
    //   () => console.log('POST COMPLETE')
    // )
  }

}
