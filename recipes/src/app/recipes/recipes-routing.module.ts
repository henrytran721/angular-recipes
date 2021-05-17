import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth-guard";
import { NoRecipeComponent } from "./no-recipe/no-recipe.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipesEditComponent } from "./recipes-edit/recipes-edit.component";
import { RecipesResolverService } from "./recipes-resolver.service";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
    {
        path: 'recipes',
        component: RecipesComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: NoRecipeComponent},
            {path: 'new', component: RecipesEditComponent},
            {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},
            {path: ':id/edit', component: RecipesEditComponent, resolve: [RecipesResolverService]}
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {}