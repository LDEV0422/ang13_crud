import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  productConditionList = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;

  constructor(private formBuilder : FormBuilder, private apiService : ApiService, private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
      // initialize form
    this.productForm = this.formBuilder.group({
      name : ['', Validators.required],
      category : ['', Validators.required],
      date : ['', Validators.required],
      condition : ['', Validators.required],
      price : ['', Validators.required],
      description : ['', Validators.required]
    });
  }

  addProduct(){
if (this.productForm.valid) {
  this.apiService.postProduct(this.productForm.value)
  .subscribe({
    // if successful
    next:(response)=>{
      alert("Product added successfully");
      this.productForm.reset();
      this.dialogRef.close('save');
    },
    // if error
    error:(err)=>{
      alert("An error occurred while adding the product")
    }
    // when complete
    // complete:()=>{

    // }
  })
}    
  }

}
