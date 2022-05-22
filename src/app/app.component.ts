import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'myMightycrud';

  // for the products table
  displayedColumns: string[] = ['name', 'category', 'date', 'condition', 'price', 'description', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  // dialog method
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        // callback method to get all products + new without having to refresh page after closing dialog
        this.getAllProducts();
      }
    })
  }

  getAllProducts() {
    this.apiService.getProduct()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert("An error occurred while fetching the data")
        }
        // when complete
        // complete:()=>{
        // }
      })
  }

  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      // pass the table row values as data to edit in the product form
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        // callback method to get all products + update without having to refresh page after closing dialog
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id: number) {
    this.apiService.deleteProduct(id)
      .subscribe({
        next:(response)=>{
          alert("Product deleted successfully");
          this.getAllProducts();
        },
        error:(err)=>{
          alert("An error occurred while deleting the product")
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
