import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerContainer } from '../models/player-container.model';
import { FantasyStats } from '../models/fantasy-stats.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {


  constructor(private httpClient: HttpClient) { }


  public root = 'http://127.0.0.1:5000/'; // Local service
  //public root = 'https://slam-stats-backend.onrender.com/'; // Update with your Render backend URL
  public allPlayers: PlayerContainer[] = [];


  getFantasyStatTitles(): Observable<string> {
    const statTitles = this.httpClient.get<string>(this.root+'fantasy-stat-titles');
    return statTitles;
  }


  getStandardDeviations(): Observable<FantasyStats> {
    const standardDeviations = this.httpClient.get<FantasyStats>(this.root+'standard-deviations');
    return standardDeviations;
  }


  // getPlayerInfo(): Observable<PlayerContainer[]> {
  //   const players = this.httpClient.get<PlayerContainer[]>(this.root+'player-info');
  //   return players;
  // }

  // Method to fetch players data with caching
  getPlayerInfo(): Observable<PlayerContainer[]> {
    if (this.allPlayers.length > 0) {
      // If data is already cached, return it as an observable
      return new Observable<PlayerContainer[]>((observer) => {
        observer.next(this.allPlayers);
        observer.complete();
      });
    } else {
      // If data is not cached, fetch it from the API
      const apiUrl = '/player-info';
      return this.httpClient.get<PlayerContainer[]>(this.root + apiUrl).pipe(
        tap((data: PlayerContainer[]) => {
          this.allPlayers = data; // Cache the data
        })
      );
    }
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


