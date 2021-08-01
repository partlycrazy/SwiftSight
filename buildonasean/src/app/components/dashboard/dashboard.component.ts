import { Component, OnChanges, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Hospital, Inventory, Shipment } from '../../shared/interfaces';
import { APIService } from '../../core/http/api.service';
import { LoginService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [APIService]
})
export class DashboardComponent implements OnInit, OnChanges {
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
  upcomingShipments: Shipment[]
  columnsToDisplay = ['name', 'qty', 'days_left'];
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

  ngOnChanges(): void {
    this.updateInventory();
  }

  async updateInventory() {
    this.activeHospital.items = new Array<Inventory>();
    let results: any[] = await this.APIService.getInventory(this.activeHospital.id, new Date().toISOString()).toPromise();
    let daysLeft: any[] = await this.APIService.getDaysLeft(this.activeHospital.id).toPromise();

    let itemsArray: Inventory[] = []
    for (let i = 0; i < results.length; i++) {
      let newItem: Inventory = {
        id: results[i].category_id,
        name: results[i].category_title,
        qty: results[i].total,
        days_left: daysLeft[i].daysleft
      }
      itemsArray.push(newItem);
    }

    let sortedItemsArray = itemsArray.sort((item1, item2) => item1.days_left - item2.days_left);

    this.activeHospital.items = sortedItemsArray;
    this.selected = new Set();
    this.selectInventory(this.activeHospital.items[0]);
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

  onShipment(shipments: Shipment[]) {
    this.upcomingShipments = shipments.slice();
    this.updateInventory();
  }
}
