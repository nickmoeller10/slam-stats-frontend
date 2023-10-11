import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlayerService } from '../../services/player.service';
import { PlayerContainer } from 'src/app/models/player-container.model';
import { Player } from 'src/app/models/player.model';
import { TableColumn } from 'src/app/models/table-column.model';
import { PlayersComponent } from '../players/players.component';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  rosterOptions: any[] = [];
  selected: any;
  rosterViewToggle = false;

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<PlayerContainer> = new MatTableDataSource<PlayerContainer>();

  @ViewChild(PlayersComponent, { static: false })
  playersComponent!: PlayersComponent;


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  public rosterList: any[] = [];
  public displayedData: Player[] = [];
  public tableColumns: TableColumn[] = [];
  public visibleColumns: TableColumn[] = [];


  constructor(private readonly playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.getLeagueInfo();
    this.getRosters();
    this.initColumns();
    this.visibleColumns = this.tableColumns.filter(column => (column.isViewable !== false || !column.hasOwnProperty('isViewable') ));
  }

  mapPlayersToRoster(): void {
    // Updates the data source to current parameters
    const dataSourceVal = this.playersComponent.selectedDataSource;
    this.playersComponent.onDataSourceChange(dataSourceVal);

    // Filters to the current team selected
    this.playersComponent.displayedData = this.playersComponent.displayedData.filter(x => {
      return x.onTeamId === this.selected.id; // Return true or false
    });
  }

  dataSourceChangeEvent(): void {
    // Filters to the current team selected
    this.playersComponent.displayedData = this.playersComponent.displayedData.filter(x => {
      return x.onTeamId === this.selected.id; // Return true or false
    });
  }

  onRosterChange($event: any) {
    if ($event.value != null) {
      this.selected = $event.value;
      this.rosterList.forEach(roster => {
        if(roster[0].onTeamId === $event.value.id) {
          this.parsePlayerData(roster);
          this.displayedData = roster;
        }
      })
      this.mapPlayersToRoster();
    }
  }

  onViewToggleChange() {
    // DETAIL VIEW
    if (this.rosterViewToggle) {
      for (const column of this.tableColumns) {
        column.isViewable = true;
      }
    } else { // FANTASY VIEW
      // Switched to Detailed View
      for (const column of this.tableColumns) {
        // Check if the column name matches any of the columns you want to hide
        if (['positionalRankings','onTeamId','offensiveRebounds','defensiveRebounds','threePointersAttempted','flagrantFouls','personalFouls','technicalFouls']
        .includes(column.dataKey)) {
          // Set isViewable to false for the matched columns
          column.isViewable = false;
        }
      }
    }
    // Update Columns, Triggers  ngOnChanges
    this.visibleColumns = this.tableColumns.filter(column => column.isViewable !== false);
    this.mapPlayersToRoster();
  }

  getRosters() {
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
      this.onRosterChange({ value: this.selected });
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
        name: 'Eligible Positions',
        dataKey: 'eligiblePositionNames'
      },
      {
        name: 'Positional Ranking',
        dataKey: 'posRank'
      },
      {
        name: 'Total Rank',
        dataKey: 'totalRank'
      },
      {
        name: 'Rating',
        dataKey: 'rating'
      },
      {
        name: 'Injury Status',
        dataKey: 'injuryStatus'
      },
      {
        name: 'Team Status',
        dataKey: 'teamStatus',
        isViewable: false
      },
      {
        name: 'Round Selected',
        dataKey: 'roundSelected',
      },
      {
        name: 'Acquisition Type',
        dataKey: 'acquisitionType'
      },
      {
        name: 'ADP',
        dataKey: 'adp',
        inputType: 'float',
      },
      {
        name: 'Percent Owned',
        dataKey: 'percentOwned',
        inputType: 'percentage'
      },
      {
        name: 'Percent Started',
        dataKey: 'percentStarted',
        inputType: 'percentage'
      },
      // {
      //   name: 'Keeper Value',
      //   dataKey: 'keeperFutureVal'
      // },
    ];
  }


}


