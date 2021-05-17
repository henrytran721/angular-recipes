import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipes.services";

@Injectable({providedIn: 'root'})

export class DataStorageService {
    constructor(private http: HttpClient, private recipesService: RecipeService, private authService: AuthService) {}
    
    // need to subscribe observable
    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        return this.http.put('https://angular-recipes-4dbf4-default-rtdb.firebaseio.com/recipes.json', recipes)
                .subscribe((response) => {
                    console.log(response);
                })
    }

    fetchRecipes() {
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            console.log(user.token);
             // retrieve recipes from endpoint, if recipes doesnt have ingredients set to empty array
            return this.http.get<Recipe[]>('https://angular-recipes-4dbf4-default-rtdb.firebaseio.com/recipes.json')
        }))
        .pipe(map(recipes => {
            return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
            });
        }),
        tap(recipes => {
            this.recipesService.setRecipes(recipes);
        }))
    }
}