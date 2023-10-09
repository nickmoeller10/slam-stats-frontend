import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerContainer } from '../models/player-container.model';
import { FantasyStats } from '../models/fantasy-stats.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {


  constructor(private httpClient: HttpClient) { }


  public root = 'http://127.0.0.1:5000/'; // Local service
  //public root = 'https://slam-stats-backend.onrender.com/'; // Update with your Render backend URL


  getFantasyStatTitles(): Observable<string> {
    const statTitles = this.httpClient.get<string>(this.root+'fantasy-stat-titles');
    return statTitles;
  }


  getStandardDeviations(): Observable<FantasyStats> {
    const standardDeviations = this.httpClient.get<FantasyStats>(this.root+'standard-deviations');
    return standardDeviations;
  }


  getPlayerInfo(): Observable<PlayerContainer[]> {
    const players = this.httpClient.get<PlayerContainer[]>(this.root+'player-info');
    return players;
  }


  getLeagueInfo(): Observable<string[]> {
    const players = this.httpClient.get<string[]>(this.root+'league');
    return players;
  }


  getRosters(): Observable<any[][]> {
    const rosters = this.httpClient.get<any[]>(this.root+'rosters');
    return rosters;
  }
}


