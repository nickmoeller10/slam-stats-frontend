import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LeagueComponent } from './components/league/league.component';
import { PlayersComponent } from './components/players/players.component';
import { TeamComponent } from './components/team/team.component';
import { TradeComponent } from './components/trade/trade.component';
import { BuildTeamComponent } from './components/build-team/build-team.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'players',
    component: PlayersComponent,
  },
  {
    path: 'team',
    component: TeamComponent,
  },
  {
    path: 'league',
    component: LeagueComponent,
  },
  {
    path: 'trade',
    component: TradeComponent,
  },
  {
    path: 'build-team',
    component: BuildTeamComponent,
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
