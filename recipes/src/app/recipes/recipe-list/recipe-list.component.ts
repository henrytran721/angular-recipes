import { Component, OnInit} from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipes.services';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];

  currentRecipe: {};

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    // gets data from centralized place in the service
    this.recipes = this.recipeService.getRecipes();
  }

}
