import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchComponent} from "./search/search.component";
import {ReservationComponent} from "./reservation/reservation.component";


const routes: Routes = [
  {path: 'search', component: SearchComponent},
  {path: 'reserve', component: ReservationComponent},
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
