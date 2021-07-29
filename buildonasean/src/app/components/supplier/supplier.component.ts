import { Component, OnInit } from '@angular/core';
import { APIService} from "../../core/http/api.service"
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Hospital, Inventory, Supplier } from '../../shared/interfaces';
import { LoginService } from '../../core/authentication/authentication.service';

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
      this.activeHospital.id = 1;
    }
  }

  expandedElement: SupplierTab | null;
  admin: boolean = false;

  activeHospital: Hospital = {
    id: null,
    name:  null,
    items: new Array<Inventory>()
  }
  oldHospitalId: number = 0;

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
    this.activeHospital.id = this.activeHospital.id === 0 ? 1 : this.activeHospital.id;
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
    return results; 
  }

  async init() {
    await this.loadInventory();
    
    var sortedArray: Inventory[] = this.activeHospital.items.sort((item1, item2) => item1.qty - item2.qty);
    this.activeHospital.items = sortedArray
    for (let i = 0; i < sortedArray.length; i++) {
      let supplierDataSource = new Array<Supplier>();
      let supplier: any = await this.loadSupplier(sortedArray[i].id);
      supplier.forEach((s: Supplier) => {
        let newSSource: Supplier = {
          id: s.id,
          name: s.name,
          expanded: false,
          item_id: sortedArray[i].id
        }
        supplierDataSource = [...supplierDataSource, newSSource]
      });
      let newSource: SupplierTab = {
        item: sortedArray[i],
        supplier: supplierDataSource
      }
      this.dataSource = [...this.dataSource, newSource];
      console.log(this.dataSource);
    }
  }

  ngOnInit(): void {
    this.init();
  }

  deleteAll(i: number) {
    this.dataSource.splice(i, 1);
  }

  changeDetected: boolean = false;

  // ngDoCheck() {
  //   console.log(this.oldHospitalId);

  //   if (this.oldHospitalId !== this.activeHospital.id) {
  //     console.log("Changed");
  //     this.changeDetected = true;
  //     // this.dataSource.length = 0;
  //     // this.oldHospitalId = this.activeHospital.id
  //   }

  //   if (this.changeDetected) {
  //     this.dataSource.length = 0;
  //     console.log("CHANGES MADE");
  //   }
  //   this.changeDetected = false;
  // }

  increment() {
    this.oldHospitalId = this.activeHospital.id;
    
    let newHospital: Hospital = this.activeHospital;
    if (this.activeHospital.id != 2) {
      this.activeHospital.id++;
    }
    // this.dataSource = new Array<SupplierTab>();
    // if (this.activeHospital.id != 2) {
    //   this.activeHospital.id++;
    //   this.init();
    // }    
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
    this.dataSource.forEach((supplier) => {
      if (supplier.item.id == elem.item_id) {
        supplier.supplier.map((v) => {
          if(v.name == elem.name) {
            v.expanded = !v.expanded;            
          }
          return v;
        })
      }
    })

  }

}

interface SupplierTab {
  item: Inventory,
  supplier: Supplier[]
}