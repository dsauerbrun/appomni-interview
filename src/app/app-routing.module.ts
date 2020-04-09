import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent, ContactEditComponent } from './app.component';

const routes: Routes = [
	{
      path: '',
      //component: OverviewComponent
      pathMatch: "full",
      redirectTo: 'contacts' //temporary for rollout default to Consulting projects page
  },
  
	{
      path: 'contacts',
      component: AppComponent
  },
	
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
