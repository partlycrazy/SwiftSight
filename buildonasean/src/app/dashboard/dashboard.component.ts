import { Component, NgModule, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Hospital, Inventory } from './inventory/inventory';
import { HospitalService } from '../hospital.service';
import { FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [HospitalService]
})
export class DashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Current Inventory', cols: 1, rows: 1 },
          { title: 'Barchart', cols: 2, rows: 1 },
        ];
      }

      return [
        { title: 'Current Inventory', cols: 1, rows: 1 },
        { title: 'Barchart', cols: 2, rows: 1 },
      ];
    })
  );

  hospitals: Array<Hospital> = []
  tdyDate: Date = new Date();
  activeHospitalId: number = null;
  activeHospital: Hospital = {
    id: null,
    name: null,
    items: null
  }
  activeItem: Inventory;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private breakpointObserver: BreakpointObserver, private hospitalService: HospitalService) {}

  ngOnInit(): void {
    this.hospitalService.getHospitals().subscribe((results: any) => {
      results.forEach((hospital: any) => {
        let newHospital: Hospital = {
          id: hospital.id,
          name: hospital.name,
          items: []
        }
        this.hospitals.push(newHospital);
      });   
    });
  }

  selectedInventory(value: Inventory) {
    this.activeItem = value;
  }
}
