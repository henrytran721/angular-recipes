import { EventEmitter, Injectable } from '@angular/core';
import {Recipe} from './recipe.model';
import Ingredient from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.services';
import { Subject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Injectable()

export class RecipeService {
    recipeSelected = new Subject<Recipe>();
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [
        new Recipe('A Test Recipe',
         'This is a test',
        'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/12/Shakshuka-19.jpg', [
            new Ingredient('Meat', 1),
            new Ingredient('Rice', 2)
        ]),
        new Recipe('Ahehe Test Recipe', 'This is a test', 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/12/Shakshuka-19.jpg', [
            new Ingredient('Water', 1),
            new Ingredient('Paper', 2)
        ])
      ];

    
    constructor(private slService: ShoppingListService) {}


    getRecipes() {
        // makes a copy of the recipes array
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }
    
    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}