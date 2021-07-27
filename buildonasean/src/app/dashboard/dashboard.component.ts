import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Hospital, Inventory } from './inventory/inventory';
import { APIService } from '../api.service';
import { FormGroup, FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from '../login.service';

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

  subscription: Subscription;

  hospitals: Array<Hospital> = []
  tdyDate: Date = new Date();
  admin: boolean = false;
  activeHospital: Hospital = {
    id: null,
    name:  null,
    items: new Array<Inventory>()
  }
  activeItem: Inventory;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private breakpointObserver: BreakpointObserver, private hospitalService: APIService, private loginService: LoginService) {
    

    // this.subscription = loginService.hospitalID$.subscribe(id => {
      
    //   this.activeHospitalId = id;
      
    // });
    this.activeHospital.id = loginService.hospitalID;
    this.activeHospital.name = "Whatever";
    console.log("activeHospitalID:", this.activeHospital.id)

    if (this.activeHospital.id == 0) {
      this.admin = true;
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
    } else {
      this.hospitalService.getInventory(this.activeHospital.id, this.tdyDate.toISOString()).subscribe((results: any) => {
        results.forEach((item: any) => {
          let newItem: Inventory = {
            id: item.item_id,
            name: item.item_name,
            qty: item.total
          }
          this.activeHospital.items = [...this.activeHospital.items, newItem];
        })
      })
    }
    
  }

  ngOnInit(): void {   
  }

  updateInventory() {
    this.activeHospital.items = new Array<Inventory>();
    this.hospitalService.getInventory(this.activeHospital.id, this.tdyDate.toISOString()).subscribe((results: any) => {
      results.forEach((item: any) => {
        let newItem: Inventory = {
          id: item.item_id,
          name: item.item_name,
          qty: item.total
        }
        this.activeHospital.items = [...this.activeHospital.items, newItem];
      })
    })
    this.tdyDate = new Date();
  }


  selectedInventory(value: Inventory) {
    this.activeItem = value;
  }
}
