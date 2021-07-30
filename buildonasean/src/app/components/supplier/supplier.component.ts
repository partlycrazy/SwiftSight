import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { APIService} from "../../core/http/api.service"
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Hospital, Inventory, Supplier } from '../../shared/interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from '../../core/authentication/authentication.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { supportsPassiveEventListeners } from '@angular/cdk/platform';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
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

export class SupplierComponent implements OnInit, AfterViewInit {

  @ViewChildren(MatPaginator) paginator !: QueryList<MatPaginator>;
  @ViewChildren(MatTable) supplyTable !: QueryList<MatTable<Supplier>>

  @ViewChild(MatPaginator, { static: true}) page: MatPaginator;

  constructor(private APIService: APIService, private loginService: LoginService) { 
    this.activeHospital.id = loginService.getCurrentHospitalId();
    if (loginService.getCurrentHospitalId() == 0) {
      this.admin = true;
      this.activeHospital.id = 1;
    }
  }

  expandedElement: SupplierTab | null;
  admin: boolean = false;

  activeHospital: Hospital = {
    id: null,
    name:  null,
    items: new Array<Inventory>(),
    patients: []
  }
  oldHospitalId: number = 0;

  dataSource: SupplierTab2[] = [];

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
      key: 'max_production',
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

  columnsToDisplay = ['name', 'max_production', 'avgDelivery', 'icon'];

  async loadInventory() {
    //this.activeHospital.id = this.activeHospital.id === 0 ? 1 : this.activeHospital.id;
    var results: any = await this.APIService.getInventory(this.activeHospital.id, new Date().toISOString()).toPromise();
    results.forEach((item: any) => {
      if (item.category_id < 1) {
        return;
      }
      let newItem: Inventory = {
        id: item.category_id,
        name: item.category_title,
        qty: item.total
      }
      this.activeHospital.items = [...this.activeHospital.items, newItem];
    })
  }

  async loadSupplier(itemID: number): Promise<Supplier[]> {
    var results: Supplier[] = await this.APIService.getSupplierByCategoryId(itemID).toPromise(); 
    return results; 
  }

  async init() {
    await this.loadInventory();
    
    var sortedArray: Inventory[] = this.activeHospital.items.sort((item1, item2) => item1.qty - item2.qty);
    this.activeHospital.items = sortedArray
    for (let i = 0; i < sortedArray.length; i++) {
      console.log(sortedArray[i]);
      let supplierArray = new Array<Supplier>();
      let supplier: any = await this.loadSupplier(sortedArray[i].id);
      supplier.forEach((s: any) => {
        let newSSource: Supplier = {
          id: s.supplier_id,
          name: s.supplier_name,
          expanded: false,
          item_id: sortedArray[i].id,
          max_production: s.max_production_amount,
          address: s.address,
          email_address: s.email_address
        }
        supplierArray = [...supplierArray, newSSource]
      });

      let newSource: SupplierTab2 = {
        item: sortedArray[i],
        supplier: new MatTableDataSource<Supplier>(supplierArray)
      }
      
      let newDataSource = [...this.dataSource];
      newDataSource.push(newSource);
      this.dataSource = newDataSource;      
      setTimeout(() => {
        this.dataSource[i].supplier.paginator = this.paginator.get(i);
        this.supplyTable.get(i).renderRows();        
      });      
    }
  }

  ngOnInit(): void { 
    
   }

  ngAfterViewInit() {
    this.init();   
    
  }

  // deleteAll(i: number) {
  //   this.dataSource.data.splice(i, 1);
  // }

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
    // this.dataSource = new MatTableDataSource<SupplierTab>();
    if (this.activeHospital.id != 0) {
      this.activeHospital.id--;
      if (this.activeHospital.id == 0) {
        return;
      } 
      this.init();
    }    
  }

  expandRow(elem: Supplier) {
    this.dataSource.map((tab) => {
      if (tab.item.id == elem.item_id) {
        tab.supplier.data.map((supp) => {
          if(supp.name === elem.name) {
            supp.expanded = !supp.expanded;
          }
          return supp;
        })
      }
    })

  }

}

interface SupplierTab2 {
  item: Inventory,
  supplier: MatTableDataSource<Supplier>
}

interface SupplierTab {
  item: Inventory,
  supplier: Supplier[]
}