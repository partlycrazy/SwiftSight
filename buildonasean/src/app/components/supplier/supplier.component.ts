import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { APIService} from "../../core/http/api.service"
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Hospital, Inventory, Supplier } from '../../shared/interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from '../../core/authentication/authentication.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';

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
    let results: any = await this.APIService.getInventory(this.activeHospital.id, new Date().toISOString()).toPromise();
    let daysLeft: any[] = await this.APIService.getDaysLeft(this.activeHospital.id).toPromise();

    for (let i = 0; i < results.length; i++) {
      let newItem: Inventory = {
        id: results[i].category_id,
        name: results[i].category_title,
        qty: results[i].total,
        days_left: daysLeft[i].daysleft
      }
      this.activeHospital.items = [...this.activeHospital.items, newItem]
    }

  }

  async loadSupplier(itemID: number): Promise<Supplier[]> {
    var results: Supplier[] = await this.APIService.getSupplierByCategoryId(itemID).toPromise(); 
    return results; 
  }

  async init() {
    await this.loadInventory();
    
    var sortedArray: Inventory[] = this.activeHospital.items.sort((item1, item2) => item1.days_left - item2.days_left);
    this.activeHospital.items = sortedArray
    for (let i = 0; i < sortedArray.length; i++) {
      // console.log(sortedArray[i]);
      let supplierArray = new Array<Supplier>();
      let supplier: any = await this.loadSupplier(sortedArray[i].id);

      for (let i = 0; i < supplier.length; i++) {
        let newSSource: Supplier = {
          id: supplier[i].supplier_id,
          name: supplier[i].supplier_name,
          expanded: false,
          category_id: supplier[i].category_id,
          item_model: [],
          max_production: supplier[i].max_production_amount,
          address: supplier[i].address,
          email_address: supplier[i].email_address
        }
        supplierArray = [...supplierArray, newSSource]
      }

      let sortedSupplierArray = supplierArray.sort((item1, item2) => item2.max_production - item1.max_production);

      let newSource: SupplierTab2 = {
        item: sortedArray[i],
        supplier: new MatTableDataSource<Supplier>(sortedSupplierArray)
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
      if (tab.item.id == elem.category_id) {
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