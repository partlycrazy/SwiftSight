import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Hospital, Inventory } from '../../shared/interfaces';
import { APIService } from '../../core/http/api.service';
import { LoginService } from 'src/app/core/authentication/authentication.service';

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
  columnsToDisplay = ['name', 'qty', 'daysLeft'];
  hospitals: Array<Hospital> = []
  admin: boolean = false;
  activeHospital: Hospital = {
    id: null,
    name: null,
    items: [],
    patients: []
  };

  constructor(private breakpointObserver: BreakpointObserver, private APIService: APIService,  private loginService: LoginService) {
    this.activeHospital.id = this.loginService.getCurrentHospitalId();
  }

  ngOnInit(): void { 
    this.updateInventory();
  }

  updateInventory() {
    this.activeHospital.items = new Array<Inventory>();
    this.APIService.getInventory(this.activeHospital.id, new Date().toISOString()).subscribe((results: any) => {
      results.forEach((item: any) => {
        if (item.category_id < 1) {
          return
        }
        let newItem: Inventory = {
          id: item.category_id,
          name: item.category_title,
          qty: item.total
        }
        this.activeHospital.items = [...this.activeHospital.items, newItem];
      })
      this.selectInventory(this.activeHospital.items[0]);
    })    
    this.selected = new Set();
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
