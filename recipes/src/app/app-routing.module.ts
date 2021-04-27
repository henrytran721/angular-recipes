import {NgModule} from "@angular/core";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { RouterModule, Routes } from "@angular/router";
import { NoRecipeComponent } from "./recipes/no-recipe/no-recipe.component";
import { RecipesEditComponent } from "./recipes/recipes-edit/recipes-edit.component";


const appRoutes:Routes = [
    {path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {
        path: 'recipes',
        component: RecipesComponent,
        children: [
            {path: '', component: NoRecipeComponent},
            {path: 'new', component: RecipesEditComponent},
            {path: ':id', component: RecipeDetailComponent},
            {path: ':id/edit', component: RecipesEditComponent}
        ]
    },
    {
        path: 'shopping-list',
        component: ShoppingListComponent,
    },

]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {

}