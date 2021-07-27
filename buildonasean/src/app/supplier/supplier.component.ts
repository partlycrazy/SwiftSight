import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { Supplier } from './supplier';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Hospital, Inventory } from '../dashboard/inventory/inventory';
import { LoginService } from '../login.service';
import { InventoryComponent } from '../dashboard/inventory/inventory.component';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SupplierComponent implements OnInit {

  constructor(private APIService: APIService, private loginService: LoginService) { 
    this.activeHospital.id = loginService.hospitalID;
    if (loginService.hospitalID == 0) {
      this.admin = true;
    }
  }

  expandedElement: SupplierTab | null;
  admin: boolean = false;

  activeHospital: Hospital = {
    id: null,
    name:  null,
    items: new Array<Inventory>()
  }

  dataSource: Array<SupplierTab> = [];

  tableDef: Array<any> = [
    {
      key: "id",
      header: "ID"
    },
    {
      key: "name",
      header: "Name"
    },
    {
      key: 'supply',
      header: "Supply Available"
    },
    {
      key: "avgDelivery",
      header: "Avg Delivery Time"
    },
    {
      key: "icon",
      header: ""
    }
  ]

  columnsToDisplay = ['id', 'name', 'supply', 'avgDelivery', 'icon'];

  async loadInventory() {
    var results: any = await this.APIService.getInventory(this.activeHospital.id, new Date().toISOString()).toPromise();
    results.forEach((item: any) => {
      let newItem: Inventory = {
        id: item.item_id,
        name: item.item_name,
        qty: item.total
      }
      this.activeHospital.items = [...this.activeHospital.items, newItem];
    })
  }

  async loadSupplier(itemID: number): Promise<Supplier[]> {
    var results: Supplier[] = await this.APIService.getSupplierByItemId(itemID).toPromise(); 
    console.log("supplier results", results);
    return results; 
  }

  async init() {
    await this.loadInventory();
    console.log(this.dataSource);
    var sortedArray: Inventory[] = this.activeHospital.items.sort((item1, item2) => item1.qty - item2.qty);

    this.activeHospital.items = sortedArray
    let i = 1;
    sortedArray.forEach(async (item) => {
      let supplierDataSource = new Array<Supplier>();      
      var supplier: any = await this.loadSupplier(item.id);
      supplier.forEach((s : Supplier) => {
        let newSSource: Supplier = {
          id: s.id,
          name: s.name,
          expanded: false,
          item_id: item.id
        }
        supplierDataSource = [...supplierDataSource, newSSource]
      })
      let newSource: SupplierTab = {
        item: item,
        supplier: supplierDataSource
      }
      i++;
      this.dataSource = [...this.dataSource, newSource];
      console.log(this.dataSource);
    })
  }

  ngOnInit(): void {
    this.init();
    console.log(this.dataSource)
  }

  deleteAll(i: number) {
    this.dataSource.splice(i, 1);
    console.log(this.dataSource);
  }

  increment() {
    this.dataSource = new Array<SupplierTab>();
    if (this.activeHospital.id != 2) {
      this.activeHospital.id++;
      this.init();
    }    
  }

  decrement() {
    this.dataSource = new Array<SupplierTab>();
    if (this.activeHospital.id != 0) {
      this.activeHospital.id--;
      if (this.activeHospital.id == 0) {
        return;
      } 
      this.init();
    }    
  }

  expandRow(elem: Supplier) {
    console.log("Trying to expand");
    console.log(elem);
    this.dataSource.forEach((supplier) => {
      if (supplier.item.id == elem.item_id) {
        supplier.supplier.map((v) => {
          if(v.name == elem.name) {
            v.expanded = !v.expanded;            
          }
          return v;
        })
      }
      // supplier.supplier.map((v) => {
          
      // })
    })

  }

}

export interface SupplierTab {
  item: Inventory,
  supplier: Supplier[]
}