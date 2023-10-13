import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlayerContainer } from 'src/app/models/player-container.model';
import { Player } from 'src/app/models/player.model';
import { TableColumn } from 'src/app/models/table-column.model';
import { PlayerService } from 'src/app/services/player.service';
import { PlayersComponent } from '../players/players.component';
import { CrudTableComponent } from 'src/app/widgets/crud-table/crud-table.component';
import { PlayerRanking } from 'src/app/models/player-ranking.model';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {

  loading = false;
  rosterOptions: any[] = [];
  selected: any;
  selected2: any;
  rosterViewToggle = false;

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<PlayerContainer> = new MatTableDataSource<PlayerContainer>();

  @ViewChild('playersComponent1', { static: false })
  playersComponent1!: PlayersComponent;

  @ViewChild('playersComponent2', { static: false })
  playersComponent2!: PlayersComponent;

  @ViewChild('roster1', { static: false })
  roster1!: CrudTableComponent;

  @ViewChild('roster2', { static: false })
  roster2!: CrudTableComponent;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  public rosterList: any[] = [];
  public displayedData: Player[] = [];
  public displayedData2: Player[] = [];
  public tableColumns: TableColumn[] = [];
  public visibleColumns: TableColumn[] = [];

  public selectedPlayersRoster1: any[] = [];
  public selectedPlayersRoster2: any[] = [];
  public selectedPlayersPlayerComp1: any[] = [];
  public selectedPlayersPlayerComp2: any[] = [];

  public originalPlayersComponentData1: PlayerRanking[] = [];
  public originalPlayersComponentData2: PlayerRanking[] = [];

  public activeTrade = false;


  constructor(private readonly playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.getLeagueInfo();
    this.getRosters();
    this.initColumns();
    this.visibleColumns = this.tableColumns.filter(column => (column.isViewable !== false || !column.hasOwnProperty('isViewable') ));
  }

  mapPlayersToRoster(): void {
    const selectedId1 = this.selected.id;
    const selectedId2 = this.selected2.id;
    let itemsToMoveToRoster1: any[] = [];
    let itemsToMoveToRoster2: any[] = [];
    let itemsToMoveToPlayerComponent2: PlayerRanking[] = [];
    let itemsToMoveToPlayerComponent1: PlayerRanking[] = [];

    if (this.originalPlayersComponentData1.length > 0) {
      // Player Components must be filtered before any trading occurs.
      this.playersComponent1.displayedData = this.originalPlayersComponentData1.filter(x => {
        return x.onTeamId === selectedId1;
      });
    } 
    if (this.originalPlayersComponentData2.length > 0) {
      this.playersComponent2.displayedData = this.originalPlayersComponentData2.filter(x => {
        return x.onTeamId === selectedId2;
      });
    }

    if (this.activeTrade) {

      // Finds all entries of roster 1 and player comp 1
      if (this.selectedPlayersRoster1.length > 0) {
        this.selectedPlayersRoster1.forEach((x: any) => {
          const rosterItem = this.displayedData.find(rosterEntry => rosterEntry.id === x.id)
          const playerCompItem = this.playersComponent1.displayedData.find(playerComponent => playerComponent.id === x.id);

          // Must add contingency that it has not already been added
          if (rosterItem != null && !this.roster2.tableDataSource.data.includes(rosterItem)) {
            rosterItem.onTeamId = selectedId2;
            itemsToMoveToRoster2.push(rosterItem);
          }
          if (playerCompItem != null && !this.playersComponent2.displayedData.includes(playerCompItem)) {
            playerCompItem.onTeamId = selectedId2;
            itemsToMoveToPlayerComponent2.push(playerCompItem);
          }
        });

        // Adds the items selected to roster 2
        this.roster2.tableDataSource.data.push(...itemsToMoveToRoster2);

        // Adds the items selected to player component 2
        this.playersComponent2.displayedData.push(...itemsToMoveToPlayerComponent2);
       // this.filterTables();
      }

      if (this.selectedPlayersRoster2.length > 0) {
        this.selectedPlayersRoster2.forEach((x: any) => {
          const rosterItem = this.displayedData2.find(rosterEntry => rosterEntry.id === x.id)
          const playerCompItem = this.playersComponent2.displayedData.find(playerComponent => playerComponent.id === x.id);

          // Must add contingency that it has not already been added
          if (rosterItem != null && !this.roster1.tableDataSource.data.includes(rosterItem)) {
            rosterItem.onTeamId = selectedId1;
            itemsToMoveToRoster1.push(rosterItem);
          }
          if (playerCompItem != null && !this.playersComponent1.displayedData.includes(playerCompItem)) {
            playerCompItem.onTeamId = selectedId1;
            itemsToMoveToPlayerComponent1.push(playerCompItem);
          }
        });

        // Adds the items selected to roster 2
        this.roster1.tableDataSource.data.push(...itemsToMoveToRoster1);

        // Adds the items selected to player component 2
        this.playersComponent1.displayedData.push(...itemsToMoveToPlayerComponent1);
        //this.filterTables();
      }

      // Finds all entries of roster 1 and player comp 1
      if (this.selectedPlayersPlayerComp1.length > 0) {
        this.selectedPlayersPlayerComp1.forEach((x: any) => {
          const rosterItem = this.displayedData.find(rosterEntry => rosterEntry.id === x.id)
          const playerCompItem = this.playersComponent1.displayedData.find(playerComponent => playerComponent.id === x.id);

          // Must add contingency that it has not already been added
          if (rosterItem != null && !this.roster2.tableDataSource.data.includes(rosterItem)) {
            rosterItem.onTeamId = selectedId2;
            itemsToMoveToRoster2.push(rosterItem);
          }
          if (playerCompItem != null && !this.playersComponent2.displayedData.includes(playerCompItem)) {
            playerCompItem.onTeamId = selectedId2;
            itemsToMoveToPlayerComponent2.push(playerCompItem);
          }
        });

        // Adds the items selected to roster 2
        this.roster2.tableDataSource.data.push(...itemsToMoveToRoster2);

        // Adds the items selected to player component 2
        this.playersComponent2.displayedData.push(...itemsToMoveToPlayerComponent2);

      //  this.filterTables();
      }

      // Finds all entries of roster 1 and player comp 1
      if (this.selectedPlayersPlayerComp2.length > 0) {
        this.selectedPlayersPlayerComp2.forEach((x: any) => {
          const rosterItem = this.displayedData2.find(rosterEntry => rosterEntry.id === x.id)
          const playerCompItem = this.playersComponent2.displayedData.find(playerComponent => playerComponent.id === x.id);

          // Must add contingency that it has not already been added
          if (rosterItem != null && !this.roster1.tableDataSource.data.includes(rosterItem)) {
            rosterItem.onTeamId = selectedId1;
            itemsToMoveToRoster1.push(rosterItem);
          }
          if (playerCompItem != null && !this.playersComponent1.displayedData.includes(playerCompItem)) {
            playerCompItem.onTeamId = selectedId1;
            itemsToMoveToPlayerComponent1.push(playerCompItem);
          }
        });

        // Adds the items selected to roster 2
        this.roster1.tableDataSource.data.push(...itemsToMoveToRoster1);

        // Adds the items selected to player component 2
        this.playersComponent1.displayedData.push(...itemsToMoveToPlayerComponent1);
       // this.filterTables();
      }

      this.filterTables();
      // Make sure displayedData matches roster tables
      if (this.displayedData !== this.roster1.tableDataSource.data) {
        this.displayedData = [...this.roster1.tableDataSource.data as Player[]]
      }

      // Make sure displayedData matches roster tables
      if (this.displayedData2 !== this.roster2.tableDataSource.data) {
        this.displayedData2 = [...this.roster2.tableDataSource.data as Player[]]
      }

      this.activeTrade = false;

    } else { // Not an active trade. Either data source change, selected team change or toggle view change
 
      this.displayedData = this.displayedData.filter(x => {
        return x.onTeamId === selectedId1;
      });

      this.displayedData2 = this.displayedData2.filter(x => {
        return x.onTeamId === selectedId2;
      });
    }

    // Need to update original player component team IDs
    if (itemsToMoveToPlayerComponent1.length > 0 || itemsToMoveToPlayerComponent2.length > 0) {
      this.updateOriginalPlayersComponentData(selectedId1, selectedId2, itemsToMoveToPlayerComponent1, itemsToMoveToPlayerComponent2);
    }

    // Need to update rosters if a trade occurred
    if (itemsToMoveToRoster1.length > 0 || itemsToMoveToRoster2.length > 0) {
      this.rosterList[selectedId1 - 1] = [...this.roster1.tableDataSource.data];
      this.rosterList[selectedId2 - 1] = [...this.roster2.tableDataSource.data];
    }

  }

  updateOriginalPlayersComponentData(selectedId1: number,selectedId2: number,
    itemsToMoveToPlayerComponent1: PlayerRanking[],  itemsToMoveToPlayerComponent2: PlayerRanking[]): void {

    for (const itemToMove of itemsToMoveToPlayerComponent1) {
      const matchingItem = this.originalPlayersComponentData1.find(
        (player: PlayerRanking) => player.id === itemToMove.id
      );
      const matchingItem2 = this.originalPlayersComponentData2.find(
        (player: PlayerRanking) => player.id === itemToMove.id
      );
      if (matchingItem) {
        matchingItem.onTeamId = selectedId1;
      }
      if (matchingItem2) {
        matchingItem2.onTeamId = selectedId1;
      }
    }

    for (const itemToMove of itemsToMoveToPlayerComponent2) {
      const matchingItem = this.originalPlayersComponentData1.find(
        (player: PlayerRanking) => player.id === itemToMove.id
      );
      const matchingItem2 = this.originalPlayersComponentData2.find(
        (player: PlayerRanking) => player.id === itemToMove.id
      );
      if (matchingItem) {
        matchingItem.onTeamId = selectedId2;
      }
      if (matchingItem2) {
        matchingItem2.onTeamId = selectedId2;
      }
    }
  }


  filterTables() {
    const selectedId1 = this.selected.id;
    const selectedId2 = this.selected2.id;
    this.roster1.tableDataSource.data = this.roster1.tableDataSource.data.filter((x: any) => {
      return x.onTeamId !== selectedId2;
    });

    this.roster2.tableDataSource.data = this.roster2.tableDataSource.data.filter((x: any) => {
      return x.onTeamId !== selectedId1;
    });

    this.playersComponent1.displayedData = this.playersComponent1.displayedData.filter((x: any) => {
      return x.onTeamId !== selectedId2;
      });
    
    this.playersComponent2.displayedData = this.playersComponent2.displayedData.filter((x: any) => {
      return x.onTeamId !== selectedId1;
      });
   }

  dataSourceChangeEvent($event: PlayerRanking[]): void {
    // Event is the original data source
    $event.forEach(eventPlayer => {
      const matchingOriginalPlayer = this.originalPlayersComponentData1.find(originalPlayer => originalPlayer.id === eventPlayer.id);
      if (matchingOriginalPlayer) {
        eventPlayer.onTeamId = matchingOriginalPlayer.onTeamId;
      }
    });
    this.originalPlayersComponentData1 = $event;

    $event.forEach(eventPlayer => {
      const matchingOriginalPlayer = this.originalPlayersComponentData2.find(originalPlayer => originalPlayer.id === eventPlayer.id);
      if (matchingOriginalPlayer) {
        eventPlayer.onTeamId = matchingOriginalPlayer.onTeamId;
      }
    });
    this.originalPlayersComponentData2 = $event;

    // Must update player component 2 to match player comp 1
    this.playersComponent2.basedOn = this.playersComponent1.basedOn;
    this.playersComponent2.selectedDataSource = this.playersComponent1.selectedDataSource;
    this.playersComponent2.determineColorTable();
    this.mapPlayersToRoster();
  }

  // Adds all selected players to associated lists
  swapPlayers(): void {
    // Cannot trade with the same team
    if(this.selected.id !== this.selected2.id) {
      this.activeTrade = true;
      if (this.originalPlayersComponentData1.length === 0) {
        this.originalPlayersComponentData1 = [...this.playersComponent1.displayedData];  
      }
      if (this.originalPlayersComponentData2.length === 0) {
        this.originalPlayersComponentData2 = [...this.playersComponent2.displayedData];
      }
      // For the Roster view
      if (!this.rosterViewToggle) {
          // Get alls selected players to add to list
          this.selectedPlayersRoster1 = this.roster1.selectedRows;
          this.selectedPlayersRoster2 = this.roster2.selectedRows;

          // Unselect the rows
          this.roster1.selectedRows = [];
          this.roster2.selectedRows = [];
      } else { // Fantasy Stats view
          this.selectedPlayersPlayerComp1 = this.playersComponent1.crudTableComponent.selectedRows;
          this.selectedPlayersPlayerComp2 = this.playersComponent2.crudTableComponent.selectedRows;

          // Unselect all rows in the player component tables
          this.playersComponent1.crudTableComponent.selectedRows = [];
          this.playersComponent2.crudTableComponent.selectedRows = [];
      }

      const playersAreSelected = this.selectedPlayersRoster1.length > 0 || this.selectedPlayersRoster2.length > 0 ||
      this.selectedPlayersPlayerComp1.length > 0 || this.selectedPlayersPlayerComp2.length > 0;

      if (playersAreSelected) {
        this.mapPlayersToRoster();  
      }
    }
  }

  onRosterChange1($event: any) {
    if ($event.value != null) {
      this.selected = $event.value;
      this.rosterList.forEach((roster: Player[]) => {
        const filteredRoster = roster.filter(player => player.onTeamId === $event.value.id);
        if (filteredRoster.length > 0) {
          this.parsePlayerData(filteredRoster);
          this.displayedData = filteredRoster;
        }
      });
      this.mapPlayersToRoster();
    }
  }

  onRosterChange2($event: any) {

    if ($event.value != null) {
      this.selected2 = $event.value;
     // const rosterListOG = JSON.parse(this.originalRosterList);
      this.rosterList.forEach((roster: Player[]) => {
        const filteredRoster = roster.filter(player => player.onTeamId === $event.value.id);
        if (filteredRoster.length > 0) {
          this.parsePlayerData(filteredRoster);
          this.displayedData2 = filteredRoster;
        }
      });
      this.mapPlayersToRoster();
    }
  }

  onViewToggleChange() {
    // DETAIL VIEW
    if (!this.rosterViewToggle) {
      // for (const column of this.tableColumns) {
      //   column.isViewable = true;
      // }
    } else { // FANTASY VIEW

        // Refreshes the original players component data
        if (this.originalPlayersComponentData1.length === 0) {
          this.originalPlayersComponentData1 = [...this.playersComponent1.displayedData];  
        }
        if (this.originalPlayersComponentData2.length === 0) {
          this.originalPlayersComponentData2 = [...this.playersComponent2.displayedData];
        }
        // Switched to Detailed View
        for (const column of this.playersComponent1.tableColumns) {
          // Check if the column name matches any of the columns you want to hide
          if (['minutesPerGame','totalRanking','adp','freeThrowsAttempted', 'freeThrowsMade', 'fieldGoalsAttempted', 'fieldGoalsMade','positionalRankings',
          'onTeamId','offensiveRebounds','defensiveRebounds','threePointersAttempted','flagrantFouls','personalFouls'
          ,'technicalFouls','rating','gamesPlayed','totalRating','ratingPerGame']
          .includes(column.dataKey)) {
            // Set isViewable to false for the matched columns
            column.isViewable = false;
          }
        }

        for (const column of this.playersComponent2.tableColumns) {
          // Check if the column name matches any of the columns you want to hide
          if (['minutesPerGame','totalRanking','adp','freeThrowsAttempted', 'freeThrowsMade', 'fieldGoalsAttempted', 'fieldGoalsMade','positionalRankings',
          'onTeamId','offensiveRebounds','defensiveRebounds','threePointersAttempted','flagrantFouls','personalFouls'
          ,'technicalFouls','rating','gamesPlayed','totalRating','ratingPerGame']
          .includes(column.dataKey)) {
            // Set isViewable to false for the matched columns
            column.isViewable = false;
          }
        }
      }
    // Update Columns, Triggers  ngOnChanges
    this.mapPlayersToRoster();
  }

  getRosters() {
    this.loading = true;
    return this.playerService.getRosters().subscribe(res => {
      let rosters: any[] = [];
      res.forEach(roster => {
        const players: Player[] = [];
        roster.forEach(entry => {
          const obj = JSON.parse(entry);
          const player: Player = {
            defaultPositionId: obj.position,
            eligibleSlots: obj.eligible_positions,
            id: obj.player_id,
            fullName: obj.name,
            injuryStatus: obj.injury_status,
            onTeamId: obj.on_team_id,
            ratings: obj.ratings,
            statContainer: obj.stats,
            teamStatus: obj.team_status,
            roundSelected: obj.keeper_future_val,
            acquisitionType: obj.acquisition_type,
            adp: obj.average_draft_position,
            percentOwned: obj.percent_owned,
            percentStarted: obj.percent_started
          }
          players.push(player);
        })
        rosters.push(players)
      })
      this.rosterList = rosters;
      this.selected = this.rosterOptions[0];
      this.selected2 = this.rosterOptions[1];
      this.onRosterChange1({ value: this.selected });
      this.onRosterChange2({ value: this.selected2 });
      this.loading = false;
    });
  }




  getLeagueInfo() {
    return this.playerService.getLeagueInfo().subscribe(res => {
      //let teamList: Team[] = [];
      res.forEach(x => {
        const obj = JSON.parse(x)
        this.rosterOptions.push({name: obj.name, id: obj.id});
      })
      this.selected = this.rosterOptions[0];
      this.selected2 = this.rosterOptions[1];
    });
  }



  // Assigns certain ratings for each player
  parsePlayerData(roster: any[]) {
    roster.forEach(player => {
      player.posRank = player.ratings[0].positionalRanking;
      player.totalRank = player.ratings[0].totalRanking;
      player.rating = player.ratings[0].totalRating.toFixed(2);
      player.eligiblePositionNames = '';
      this.mapPosition(player);
    })
  }

  mapPosition(player: Player): void {
    switch (player.defaultPositionId) {
      case 1:
        player.defaultPositionName = 'PG';
        break;
      case 2:
        player.defaultPositionName = 'SG';
        break;
      case 3:
        player.defaultPositionName = 'SF';
        break;
      case 4:
        player.defaultPositionName = 'PF';
        break;
      case 5:
        player.defaultPositionName = 'C';
        break;            
    }

    player.eligibleSlots?.forEach(index => {
      switch (index) {
        case 0:
          if (player?.eligiblePositionNames?.length === 0 ) {
            player.eligiblePositionNames = 'PG '
          } else {
            player.eligiblePositionNames = player.eligiblePositionNames + 'PG '
          }
          break;
        case 1:
          if (player?.eligiblePositionNames?.length === 0 ) {
            player.eligiblePositionNames = 'SG '
          } else {
            player.eligiblePositionNames = player.eligiblePositionNames + 'SG '
          }
          break;
        case 2:
          if (player?.eligiblePositionNames?.length === 0 ) {
            player.eligiblePositionNames = 'SF '
          } else {
            player.eligiblePositionNames = player.eligiblePositionNames + 'SF '
          }
          break;
        case 3:
          if (player?.eligiblePositionNames?.length === 0 ) {
            player.eligiblePositionNames = 'PF '
          } else {
            player.eligiblePositionNames = player.eligiblePositionNames + 'PF '
          }
          break;
        case 4:
          if (player?.eligiblePositionNames?.length === 0 ) {
            player.eligiblePositionNames = 'C '
          } else {
            player.eligiblePositionNames = player.eligiblePositionNames + 'C'
          }
          break;       
      }
    })
  }

  private initColumns(): void  {
    this.tableColumns = [
      {
        name: 'Name',
        dataKey: 'fullName'
      },
      // {
      //   name: 'Main Position',
      //   dataKey: 'defaultPositionName'
      // },
      {
        name: 'Pos',
        dataKey: 'eligiblePositionNames',
      },
      {
        name: 'Pos Rank',
        dataKey: 'posRank',
      },
      {
        name: 'Total Rank',
        dataKey: 'totalRank',
        isViewable: false,
      },
      {
        name: 'Status',
        dataKey: 'injuryStatus',
      },
      {
        name: 'Team Status',
        dataKey: 'teamStatus',
        isViewable: false
      },
      {
        name: 'Round Selected',
        dataKey: 'roundSelected',
        isViewable: false,
      },
      {
        name: 'Acquisition Type',
        dataKey: 'acquisitionType',
        isViewable: false,
      },
      {
        name: 'ADP',
        dataKey: 'adp',
        inputType: 'float',
        isViewable: false,
      },
      {
        name: '% Owned',
        dataKey: 'percentOwned',
        inputType: 'percentage',
      },
      {
        name: '% Started',
        dataKey: 'percentStarted',
        inputType: 'percentage',
        isViewable: false
      },
      {
        name: 'Rating',
        dataKey: 'rating'
      },
      // {
      //   name: 'Keeper Value',
      //   dataKey: 'keeperFutureVal'
      // },
    ];
  }


}
