import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  productConditionList = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;
  // to switch name of dialog button : edit or save
  actionBtn: string = "Save";

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    // to inject data in dialog window for edit method
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) { }

  ngOnInit(): void {
    // initialize form
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required]
    });

    // pass product data in the form for edit method
    if (this.editData) {
      this.actionBtn = "Update";
      this.productForm.controls['name'].setValue(this.editData.name);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['condition'].setValue(this.editData.condition);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['description'].setValue(this.editData.description);
    }
  }

  addProduct() {
    // if the form is not on edit method, add new product
    if (!this.editData) {
      if (this.productForm.valid) {
        this.apiService.postProduct(this.productForm.value)
          .subscribe({
            // if successful
            next: (response) => {
              alert("Product added successfully");
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            // if error
            error: (err) => {
              alert("An error occurred while adding the product");
            }
            // when complete
            // complete:()=>{ 
            // }
          })
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct(){
    this.apiService.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      // if successful
      next: (response) => {
        alert("Product updated successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      // if error
      error: (err) => {
        alert("An error occurred while updating the product");
      }
      // when complete
      // complete:()=>{
      // }
    })
  }

}
