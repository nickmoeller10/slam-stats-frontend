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
  public filteredPlayers: PlayerRanking[] = [];
  public addedPlayers: PlayerRanking[] = [];
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

  onDataSourceChange(data: PlayerRanking[]) {
    // Update original data source
    this.originalPlayersDataComponent = [...data]; 

    data = data.filter(dataItem => {
      return this.addedPlayers.some(addedPlayer => addedPlayer.id === dataItem.id);
    });

    this.playersComponent.displayedData = [...data];

    // // Filter to be already selected players
    // this.playersComponent.displayedData = data.filter(x => {
    //   return this.addedPlayers.includes(x) // Return true or false
    // });
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

        // Filter out players that are already in the addedPlayers array
      const newPlayers = this.searchResults.filter((player) => {
        return !this.addedPlayers.some((addedPlayer) => addedPlayer.id === player.id);
      });

      this.playersComponent.displayedData = [
        ...this.playersComponent.displayedData,
        ...newPlayers
      ];
      
      // Clear the search input and results
      this.searchQuery = '';
      this.searchResults = [];
      
      this.addedPlayers = [...this.playersComponent.displayedData];
      this.cdRef.detectChanges();
    }
  }

  removePlayer() {
    // Get the selected player IDs
    const selectedPlayerIds = this.playersComponent.crudTableComponent.selectedRows.map(player => player.id);
  
    // Filter the displayed data to remove the selected players
    this.playersComponent.displayedData = this.playersComponent.displayedData.filter(player =>
      !selectedPlayerIds.includes(player.id)
    );
  
    // Clear the selected rows
    this.playersComponent.crudTableComponent.selectedRows = [];
  
    // Optionally, you can also update the addedPlayers array if needed
    this.addedPlayers = this.playersComponent.displayedData;
  
    // Call change detection to update the view
    this.cdRef.detectChanges();
  }
  

}
