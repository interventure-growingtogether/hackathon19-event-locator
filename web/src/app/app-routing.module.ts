import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchComponent} from "./search/search.component";
import {ReservationComponent} from "./reservation/reservation.component";
import {ReservationsComponent} from "./reservations/reservations.component";
import {ListingsComponent} from "./listings/listings.component";


const routes: Routes = [
  {path: 'search', component: SearchComponent},
  {path: 'reservations', component: ReservationsComponent},
  {path: 'listings', component: ListingsComponent},
  {path: 'reserve/:spaceId', component: ReservationComponent},
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
