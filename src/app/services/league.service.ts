import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerContainer } from '../models/player-container.model';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
 // public root = 'http://127.0.0.1:5000/'; // Local service
  public allPlayers: PlayerContainer[] = [];
  public root = 'https://slam-stats-backend.onrender.com/'; // Update with your Render backend URL


  constructor(private http: HttpClient) { }

  public season = 0;

  // Method to update the league configuration on the backend
  updateLeagueConfiguration(data: any): Observable<any> {
    const apiUrl = 'generate-league'; 
    this.season = Number(data.season);
    return this.http.post<any>(this.root+apiUrl, data).pipe(
      map((response) => {
        localStorage.setItem('leagueId', data.league_id);
        localStorage.setItem('season', data.season);
        localStorage.setItem('swid', data.swid);
        localStorage.setItem('espnS2', data.espn_s2);

        // Store all player data locally
       // this.allPlayers = response.players_info;
        //localStorage.setItem('allPlayers', JSON.stringify(this.allPlayers));
        return {response};
      })
    );
  }
}
