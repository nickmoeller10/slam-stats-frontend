import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PlayersComponent } from '../players/players.component';
import { ThisReceiver } from '@angular/compiler';
import { PlayerRanking } from 'src/app/models/player-ranking.model';

@Component({
  selector: 'app-build-team',
  templateUrl: './build-team.component.html',
  styleUrls: ['./build-team.component.scss']
})
export class BuildTeamComponent implements OnInit, AfterViewInit {


  @ViewChild('playersComponent', { static: false })
  playersComponent!: PlayersComponent;

  public originalPlayersDataComponent: PlayerRanking[] = [];
  public searchedPlayers: PlayerRanking[] = [];
  public searchQuery: string = '';
  public searchResults: PlayerRanking[] = [];
  filteredPlayers: PlayerRanking[] = [];
  playerToAdd: PlayerRanking | undefined;

  private playersComponentReady = false;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.playersComponentReady = !!this.playersComponent;
    if (this.playersComponentReady) {
      // Initialize original data if playersComponent is ready
      this.originalPlayersDataComponent = JSON.parse(JSON.stringify(this.playersComponent.displayedData));
      this.playersComponent.displayedData = [];
    }
  }

  ngAfterViewInit(): void {
    if (this.playersComponent) {
      this.playersComponentReady = true;
      this.originalPlayersDataComponent = JSON.parse(JSON.stringify(this.playersComponent.displayedData));
      if (this.playersComponent.displayedData.length > 0) {
        this.playersComponent.displayedData = [];
      }
    }
  }

  // Listen for an event that signals playersComponent readiness
  onPlayersComponentReady(data: PlayerRanking[]) {
    if (data) {
      this.playersComponentReady = true;
      this.originalPlayersDataComponent = JSON.parse(JSON.stringify(data));
      if (this.playersComponentReady && this.playersComponent) {
        this.playersComponent.displayedData = [];
      }
    }
  }

  searchPlayers() {
    // Filter the players based on the searchQuery
    this.filteredPlayers = this.originalPlayersDataComponent.filter((player) =>
      player.fullName?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectPlayer(selectedPlayer: PlayerRanking) {
    this.playerToAdd = selectedPlayer;
    this.searchResults = this.originalPlayersDataComponent.filter((player) => {
      if (selectedPlayer.id != null) {
        return player.id === selectedPlayer.id;
      } else {
        return;
      }
    });
  
    // Clear the search input and filtered list
    this.searchQuery = '';
    this.filteredPlayers = [];
  }

  addPlayer() {
    // Check if there are search results
    if (this.searchResults.length > 0) {

      this.playersComponent.displayedData = [
        ...this.playersComponent.displayedData,
        ...this.searchResults
      ];
      
      // Clear the search input and results
      this.searchQuery = '';
      this.searchResults = [];
      this.cdRef.detectChanges();
    }
  }

}
