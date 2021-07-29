import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Hospital, Inventory } from '../../shared/interfaces';
import { APIService } from '../../core/http/api.service';
import { LoginService } from '../../core/authentication/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [APIService]
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

  selected: Set<string> = new Set();
  columnsToDisplay = ['name', 'qty'];
  hospitals: Array<Hospital> = []
  admin: boolean = false;
  activeHospital: Hospital = {
    id: null,
    name: null,
    items: []
  }

  constructor(private breakpointObserver: BreakpointObserver, private APIService: APIService, private loginService: LoginService) {
    
  }

  ngOnInit(): void { 

    this.activeHospital.id = this.loginService.hospitalID;
    this.activeHospital.name = "Whatever"

    if (this.activeHospital.id == 0) {
      this.admin = true;
      console.log("Admin Account")
      this.APIService.getHospitals().subscribe((results: any) => {
        results.forEach((hospital: any) => {
          let newHos: Hospital = {
            id: hospital.id,
            name: hospital.name,
            items: []
          }
          this.hospitals.push(newHos);
        });   
      });
    } else {
      this.updateInventory();   
    }        
  }

  updateInventory() {
    this.activeHospital.items = new Array<Inventory>();
    this.APIService.getInventory(this.activeHospital.id, new Date().toISOString()).subscribe((results: any) => {
      results.forEach((item: any) => {
        let newItem: Inventory = {
          id: item.item_id,
          name: item.item_name,
          qty: item.total
        }
        this.activeHospital.items = [...this.activeHospital.items, newItem];
      })
      this.selectInventory(this.activeHospital.items[0]);
    })    
  }

  selectInventory(value: Inventory) {
    if (!this.selected.has(value.name)) {
      this.selected.add(value.name);
      this.selected = new Set(this.selected);
    } else {
      this.selected.delete(value.name);
      this.selected = new Set(this.selected);
    }
  } 
}
