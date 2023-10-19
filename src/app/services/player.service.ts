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


 // public root = 'http://127.0.0.1:5000/'; // Local service
  public root = 'https://slam-stats-backend.onrender.com/'; // Update with your Render backend URL
  public allPlayers: PlayerContainer[] = [];
  public leagueInfo: string[] = [];
  public rosters: any[] = [];
  public fantasyStatTitles: string = '';
  public standardDeviations: FantasyStats = {};

  getFantasyStatTitles(): Observable<string> {
    if (this.fantasyStatTitles) {
      // If data is already cached, return it as an observable
      return new Observable<string>((observer) => {
        observer.next(this.fantasyStatTitles);
        observer.complete();
      });
    } else {
      // If data is not cached, fetch it from the API
      const apiUrl = 'fantasy-stat-titles';
      return this.httpClient.get<string>(this.root + apiUrl).pipe(
        tap((data: string) => {
          this.fantasyStatTitles = data; // Cache the data
        })
      );
    }
  }
  
  getStandardDeviations(): Observable<FantasyStats> {
    if (JSON.stringify(this.standardDeviations) !== '{}') {
      // If data is already cached, return it as an observable
      return new Observable<FantasyStats>((observer) => {
        observer.next(this.standardDeviations);
        observer.complete();
      });
    } else {
      // If data is not cached, fetch it from the API
      const apiUrl = 'standard-deviations';
      return this.httpClient.get<FantasyStats>(this.root + apiUrl).pipe(
        tap((data: FantasyStats) => {
          this.standardDeviations = data; // Cache the data
        })
      );
    }
  }

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
      const apiUrl = 'player-info';
      return this.httpClient.get<PlayerContainer[]>(this.root + apiUrl).pipe(
        tap((data: PlayerContainer[]) => {
          this.allPlayers = data; // Cache the data
        })
      );
    }
  }

  getLeagueInfo(): Observable<string[]> {
    if (this.leagueInfo.length > 0) {
      // If data is already cached, return it as an observable
      return new Observable<string[]>((observer) => {
        observer.next(this.leagueInfo);
        observer.complete();
      });
    } else {
      // If data is not cached, fetch it from the API
      const apiUrl = 'league';
      return this.httpClient.get<string[]>(this.root + apiUrl).pipe(
        tap((data: string[]) => {
          this.leagueInfo = data; // Cache the data
        })
      );
    }
  }
  
  getRosters(): Observable<any[][]> {
    if (this.rosters.length > 0) {
      // If data is already cached, return it as an observable
      return new Observable<any[][]>((observer) => {
        observer.next(this.rosters);
        observer.complete();
      });
    } else {
      // If data is not cached, fetch it from the API
      const apiUrl = 'rosters';
      return this.httpClient.get<any[]>(this.root + apiUrl).pipe(
        tap((data: any[]) => {
          this.rosters = data; // Cache the data
        })
      );
    }
  }
}


