import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipes.services';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  currentRecipe: {};

  constructor(private recipeService: RecipeService, private router:Router) { }

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged.subscribe((recipeArr: Recipe[]) => {
      this.recipes = recipeArr;
    })
    // gets data from centralized place in the service
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  navigateNew() {
    this.router.navigate(['recipes', 'new']);
  }

}
