import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import Ingredient from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.services'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @Output() ingredient = new EventEmitter<{name: string, amount: number}>();
  @ViewChild('f') addItemForm: NgForm;
  subscription: Subscription;
  item: Ingredient;
  editMode = false;
  index: number;
  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe((val) => {
      this.index = val;
      this.item = this.slService.getIngredient(val);
      this.editMode = true;
      this.addItemForm.setValue({
        name: this.item.name,
        amount: this.item.amount
      })
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // addIngredient() {
  //   const newIngredient = new Ingredient(this.nameInput.nativeElement.value, this.amountInput.nativeElement.value);
  //   this.slService.addIngredient(newIngredient);
  // }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode === false) {
      this.slService.addIngredient(newIngredient);
    } else {
      this.slService.updateIngredient(this.index, newIngredient);
    }

    this.resetForm();
  }

  clearForm() {
    this.addItemForm.reset();
  }

  deleteItem() {
    this.slService.deleteIngredient(this.index);
    this.editMode = false;
    this.resetForm();
  }

  resetForm() {
    this.editMode = false;
    this.addItemForm.reset();
  }
}
