import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlayerService } from '../../services/player.service';
import { PlayerContainer } from 'src/app/models/player-container.model';
import { PlayerRanking } from 'src/app/models/player-ranking.model';
import { TableColumn } from 'src/app/models/table-column.model';
import { CrudTableComponent } from 'src/app/widgets/crud-table/crud-table.component';
import { FantasyStats } from 'src/app/models/fantasy-stats.model';
import { ColorTable } from 'src/app/models/color-table.model';
import { LeagueService } from 'src/app/services/league.service';
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  @Input() source: string = '';
  @Input() hasFooter = false;
  @Output() dataSourceChangeEvent: EventEmitter<void> = new EventEmitter<void>();


  displayedColumns: string[] = ['id', 'defaultPositionId', 'fullName', 'jersey', 'proTeamId'];
  dataSource: MatTableDataSource<PlayerContainer> = new MatTableDataSource<PlayerContainer>();
  selectedDataSource = 0;
  fantasyViewToggle = false;
  currentSeason = 2024 - 1; // Current Season
  dataSourceOptions: {id: number, value: string}[];

  totalOrAverages = ['Averages', 'Totals']
  basedOn = 'Averages'


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(CrudTableComponent)
  crudTableComponent!: CrudTableComponent;


  public displayedData: PlayerRanking[] = [];
  public playerRankingsDataCurr: PlayerRanking[] = [];
  public playerRankingsData7: PlayerRanking[] = [];
  public playerRankingsData15: PlayerRanking[] = [];
  public playerRankingsData30: PlayerRanking[] = [];
  public playerRankingsDataProj: PlayerRanking[] = [];
  public playerRankingsDataPrev: PlayerRanking[] = [];
  public playerRankingsDataPrevProj: PlayerRanking[] = [];


  public playerAvgRankingsDataCurr: PlayerRanking[] = [];
  public playerAvgRankingsData7: PlayerRanking[] = [];
  public playerAvgRankingsData15: PlayerRanking[] = [];
  public playerAvgRankingsData30: PlayerRanking[] = [];
  public playerAvgRankingsDataProj: PlayerRanking[] = [];
  public playerAvgRankingsDataPrev: PlayerRanking[] = [];
  public playerAvgRankingsDataPrevProj: PlayerRanking[] = [];


  public standardDeviationCutoffs: FantasyStats = {};
  public standardDeviationColorTable: ColorTable = {};


  //public fantasyStatTitles: any = [];
  public playerInfo: PlayerContainer[] = [];
  public tableColumns: TableColumn[] = [];
  public visibleColumns: TableColumn[] = [];


  constructor(private readonly playerService: PlayerService, private cdr: ChangeDetectorRef, private leagueService: LeagueService,
    private fb: FormBuilder) {
      if (this.leagueService.season) {
        this.currentSeason = this.leagueService.season - 1 ;
      }
      this.dataSourceOptions = [{id:0, value: '' + this.currentSeason + '-' + (this.currentSeason + 1).toString().slice(-2) + ' Regular Season'},
      {id:1, value:'Last 7 Days'}, 
      {id:2,value:'Last 15 Days'},
      {id:3, value:'Last 30 Days'}, 
      {id:4, value:  '' + this.currentSeason + '-' + (this.currentSeason + 1).toString().slice(-2) + ' Regular Season Projections'}, 
      {id:5, value: '' + (this.currentSeason - 1).toString() + '-' + (this.currentSeason).toString().slice(-2) + ' Regular Season'}, 
      {id:6, value: '' + (this.currentSeason - 1).toString() + '-' + (this.currentSeason).toString().slice(-2) + ' Regular Season Projections'}];
  }


  ngOnInit(): void {
    this.getStandardDeviations()
    this.getPlayers();
    this.initColumns();
    this.visibleColumns = this.tableColumns.filter(column => column.isViewable !== false);
  }


  getStandardDeviations() {
    return this.playerService.getStandardDeviations().subscribe(
      (res) => {
        this.standardDeviationCutoffs = res;
        this.determineColorTable();
      });
    }

  mapEligiblePositions(eligibleSlots: number[] | undefined): string {
    let eligiblePositionNames = '';
    if (eligibleSlots != undefined) {
      eligibleSlots.forEach(index => {
        switch (index) {
          case 0:
            if (eligiblePositionNames?.length === 0 ) {
              eligiblePositionNames = 'PG '
            } else {
              eligiblePositionNames = eligiblePositionNames + 'PG '
            }
            break;
          case 1:
            if (eligiblePositionNames?.length === 0 ) {
              eligiblePositionNames = 'SG '
            } else {
              eligiblePositionNames = eligiblePositionNames + 'SG '
            }
            break;
          case 2:
            if (eligiblePositionNames?.length === 0 ) {
              eligiblePositionNames = 'SF '
            } else {
              eligiblePositionNames = eligiblePositionNames + 'SF '
            }
            break;
          case 3:
            if (eligiblePositionNames?.length === 0 ) {
              eligiblePositionNames = 'PF '
            } else {
              eligiblePositionNames = eligiblePositionNames + 'PF '
            }
            break;
          case 4:
            if (eligiblePositionNames?.length === 0 ) {
              eligiblePositionNames = 'C '
            } else {
              eligiblePositionNames = eligiblePositionNames + 'C'
            }
            break;       
        }
      })
      return eligiblePositionNames;
    } else {
      return eligiblePositionNames;
    }
  }

  determineColorTable(): void {
    this.standardDeviationColorTable = {};
    if (this.basedOn === 'Averages') {
      switch (this.selectedDataSource) {
        case 0:
          this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_avg_curr;
          this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_avg_curr;
          this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_avg_curr;
          this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_avg_curr;
          this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_avg_curr;
          this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_avg_curr;
          this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_avg_curr;
          this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_avg_curr;
          this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_avg_curr;
          this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_avg_curr;
          this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_avg_curr;
          this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_avg_curr;
          this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_avg_curr;
          break;
        case 1:
          this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_avg_7;
          this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_avg_7;
          this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_avg_7;
          this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_avg_7;
          this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_avg_7;
          this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_avg_7;
          this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_avg_7;
          this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_avg_7;
          this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_avg_7;
          this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_avg_7;
          this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_avg_7;
          this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_avg_7;
          this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_avg_7;
          break;
        case 2:
          this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_avg_15;
          this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_avg_15;
          this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_avg_15;
          this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_avg_15;
          this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_avg_15;
          this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_avg_15;
          this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_avg_15;
          this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_avg_15;
          this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_avg_15;
          this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_avg_15;
          this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_avg_15;
          this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_avg_15;
          this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_avg_15;
          break;
        case 3:
          this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_avg_30;
          this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_avg_30;
          this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_avg_30;
          this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_avg_30;
          this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_avg_30;
          this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_avg_30;
          this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_avg_30;
          this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_avg_30;
          this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_avg_30;
          this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_avg_30;
          this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_avg_30;
          this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_avg_30;
          this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_avg_30;
          break;
        
        case 4:
          this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_avg_proj;
          this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_avg_proj;
          this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_avg_proj;
          this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_avg_proj;
          this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_avg_proj;
          this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_avg_proj;
          this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_avg_proj;
          this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_avg_proj;
          this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_avg_proj;
          this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_avg_proj;
          this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_avg_proj;
          this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_avg_proj;
          this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_avg_proj;
          break;
        
        case 5:
          this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_avg_prev;
          this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_avg_prev;
          this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_avg_prev;
          this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_avg_prev;
          this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_avg_prev;
          this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_avg_prev;
          this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_avg_prev;
          this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_avg_prev;
          this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_avg_prev;
          this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_avg_prev;
          this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_avg_prev;
          this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_avg_prev;
          this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_avg_prev;
          break;
        
        case 6:
          this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_avg_prevProj;
          this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_avg_prevProj;
          this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_avg_prevProj;
          this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_avg_prevProj;
          this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_avg_prevProj;
          this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_avg_prevProj;
          this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_avg_prevProj;
          this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_avg_prevProj;
          this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_avg_prevProj;
          this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_avg_prevProj;
          this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_avg_prevProj;
          this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_avg_prevProj;
          this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_avg_prevProj;
          break;
      default:
        // Handle default case if needed
        break;
      }
    } else { // Totals
        switch (this.selectedDataSource) {
          case 0:
            this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_curr;
            this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_curr;
            this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_curr;
            this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_curr;
            this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_curr;
            this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_curr;
            this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_curr;
            this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_curr;
            this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_curr;
            this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_curr;
            this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_curr;
            this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_curr;
            this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_curr;
            break;
          case 1:
            this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_7;
            this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_7;
            this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_7;
            this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_7;
            this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_7;
            this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_7;
            this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_7;
            this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_7;
            this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_7;
            this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_7;
            this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_7;
            this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_7;
            this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_7;
            break;
          case 2:
            this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_15;
            this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_15;
            this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_15;
            this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_15;
            this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_15;
            this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_15;
            this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_15;
            this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_15;
            this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_15;
            this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_15;
            this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_15;
            this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_15;
            this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_15;
            break;
          case 3:
            this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_30;
            this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_30;
            this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_30;
            this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_30;
            this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_30;
            this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_30;
            this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_30;
            this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_30;
            this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_30;
            this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_30;
            this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_30;
            this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_30;
            this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_30;
            break;
          
          case 4:
            this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_proj;
            this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_proj;
            this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_proj;
            this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_proj;
            this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_proj;
            this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_proj;
            this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_proj;
            this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_proj;
            this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_proj;
            this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_proj;
            this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_proj;
            this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_proj;
            this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_proj;
            break;
          
          case 5:
            this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_prev;
            this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_prev;
            this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_prev;
            this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_prev;
            this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_prev;
            this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_prev;
            this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_prev;
            this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_prev;
            this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_prev;
            this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_prev;
            this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_prev;
            this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_prev;
            this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_prev;
            break;
          
          case 6:
            this.standardDeviationColorTable.assists = this.standardDeviationCutoffs?.assists_prevProj;
            this.standardDeviationColorTable.points = this.standardDeviationCutoffs?.points_prevProj;
            this.standardDeviationColorTable.rebounds = this.standardDeviationCutoffs?.rebounds_prevProj;
            this.standardDeviationColorTable.blocks = this.standardDeviationCutoffs?.blocks_prevProj;
            this.standardDeviationColorTable.steals = this.standardDeviationCutoffs?.steals_prevProj;
            this.standardDeviationColorTable.turnovers = this.standardDeviationCutoffs?.turnovers_prevProj;
            this.standardDeviationColorTable.fieldGoalsAttempted = this.standardDeviationCutoffs?.fga_prevProj;
            this.standardDeviationColorTable.fieldGoalsMade = this.standardDeviationCutoffs?.fgm_prevProj;
            this.standardDeviationColorTable.fieldGoalPercentage = this.standardDeviationCutoffs?.fgp_prevProj;
            this.standardDeviationColorTable.freeThrowsMade = this.standardDeviationCutoffs?.ftm_prevProj;
            this.standardDeviationColorTable.freeThrowsAttempted = this.standardDeviationCutoffs?.fta_prevProj;
            this.standardDeviationColorTable.freeThrowPercentage = this.standardDeviationCutoffs?.ftp_prevProj;
            this.standardDeviationColorTable.threePointersMade = this.standardDeviationCutoffs?.tpm_prevProj;
            break;
        default:
          // Handle default case if needed
          break;
        }
    }
  }

  onViewToggleChange() {
    // DETAIL VIEW
    if (this.fantasyViewToggle) {
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
  }


  getPlayers() {
    return this.playerService.getPlayerInfo().subscribe(res => {
      //TOTALS
      const playerRankingsListCurr: PlayerRanking[] = [];
      const playerRankingsList7: PlayerRanking[] = [];
      const playerRankingsList15: PlayerRanking[] = [];
      const playerRankingsList30: PlayerRanking[] = [];
      const playerRankingsListProj: PlayerRanking[] = [];
      const playerRankingsListPrev: PlayerRanking[] = [];
      const playerRankingsListPrevProj: PlayerRanking[] = [];


      //AVERAGES
      const playerAvgRankingsListCurr: PlayerRanking[] = [];
      const playerAvgRankingsList7: PlayerRanking[] = [];
      const playerAvgRankingsList15: PlayerRanking[] = [];
      const playerAvgRankingsList30: PlayerRanking[] = [];
      const playerAvgRankingsListProj: PlayerRanking[] = [];
      const playerAvgRankingsListPrev: PlayerRanking[] = [];
      const playerAvgRankingsListPrevProj: PlayerRanking[] = [];


      res.forEach(entry => {
        // Removes all players that do not have relevant stats
        if (entry.ratings?.ratingsCurr.totalRanking != null && entry.ratings?.ratingsCurr.totalRanking !== 0) {
          if (entry.player?.statContainer?.currentSeason) {
            const playerRankingCurr: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsCurr.positionalRanking,
              totalRanking: entry.ratings?.ratingsCurr.totalRanking,
              totalRating: entry.ratings?.ratingsCurr.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.currentSeason.stats[0],
              blocks: entry.player?.statContainer?.currentSeason.stats[1],
              steals: entry.player?.statContainer?.currentSeason.stats[2],
              assists: entry.player?.statContainer?.currentSeason.stats[3],
              offensiveRebounds: entry.player?.statContainer?.currentSeason.stats[4],
              defensiveRebounds: entry.player?.statContainer?.currentSeason.stats[5],
              rebounds: entry.player?.statContainer?.currentSeason.stats[6],
              ejections: entry.player?.statContainer?.currentSeason.stats[7],
              flagrantFouls: entry.player?.statContainer?.currentSeason.stats[8],
              personalFouls: entry.player?.statContainer?.currentSeason.stats[9],
              technicalFouls: entry.player?.statContainer?.currentSeason.stats[10],
              turnovers: entry.player?.statContainer?.currentSeason.stats[11],
              idk: entry.player?.statContainer?.currentSeason.stats[12],
              fieldGoalsMade: entry.player?.statContainer?.currentSeason.stats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.currentSeason.stats[14],
              freeThrowsMade: entry.player?.statContainer?.currentSeason.stats[15],
              freeThrowsAttempted: entry.player?.statContainer?.currentSeason.stats[16],
              threePointersMade: entry.player?.statContainer?.currentSeason.stats[17],
              threePointersAttempted: entry.player?.statContainer?.currentSeason.stats[18],
              fieldGoalPercentage: entry.player?.statContainer?.currentSeason.stats[19],
              freeThrowPercentage: entry.player?.statContainer?.currentSeason.stats[20],
              threePointPercentage: entry.player?.statContainer?.currentSeason.stats[21],
              minutesPerGame: entry.player?.statContainer?.currentSeason.stats[28],
              gamesPlayed: entry.player?.statContainer?.currentSeason.stats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerRankingsListCurr.push(playerRankingCurr);
          }


          if (entry.player?.statContainer?.lastFifteen) {
            const playerRanking15: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsPrev15.positionalRanking,
              totalRanking: entry.ratings?.ratingsPrev15.totalRanking,
              totalRating: entry.ratings?.ratingsPrev15.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.lastFifteen.stats[0],
              blocks: entry.player?.statContainer?.lastFifteen.stats[1],
              steals: entry.player?.statContainer?.lastFifteen.stats[2],
              assists: entry.player?.statContainer?.lastFifteen.stats[3],
              offensiveRebounds: entry.player?.statContainer?.lastFifteen.stats[4],
              defensiveRebounds: entry.player?.statContainer?.lastFifteen.stats[5],
              rebounds: entry.player?.statContainer?.lastFifteen.stats[6],
              ejections: entry.player?.statContainer?.lastFifteen.stats[7],
              flagrantFouls: entry.player?.statContainer?.lastFifteen.stats[8],
              personalFouls: entry.player?.statContainer?.lastFifteen.stats[9],
              technicalFouls: entry.player?.statContainer?.lastFifteen.stats[10],
              turnovers: entry.player?.statContainer?.lastFifteen.stats[11],
              idk: entry.player?.statContainer?.lastFifteen.stats[12],
              fieldGoalsMade: entry.player?.statContainer?.lastFifteen.stats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.lastFifteen.stats[14],
              freeThrowsMade: entry.player?.statContainer?.lastFifteen.stats[15],
              freeThrowsAttempted: entry.player?.statContainer?.lastFifteen.stats[16],
              threePointersMade: entry.player?.statContainer?.lastFifteen.stats[17],
              threePointersAttempted: entry.player?.statContainer?.lastFifteen.stats[18],
              fieldGoalPercentage: entry.player?.statContainer?.lastFifteen.stats[19],
              freeThrowPercentage: entry.player?.statContainer?.lastFifteen.stats[20],
              threePointPercentage: entry.player?.statContainer?.lastFifteen.stats[21],
              minutesPerGame: entry.player?.statContainer?.lastFifteen.stats[28],
              gamesPlayed: entry.player?.statContainer?.lastFifteen.stats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerRankingsList15.push(playerRanking15);
          }


          if (entry.player?.statContainer?.lastSeven?.averageStats) {
            const playerRanking7: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsPrev7.positionalRanking,
              totalRanking: entry.ratings?.ratingsPrev7.totalRanking,
              totalRating: entry.ratings?.ratingsPrev7.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.lastSeven.stats[0],
              blocks: entry.player?.statContainer?.lastSeven.stats[1],
              steals: entry.player?.statContainer?.lastSeven.stats[2],
              assists: entry.player?.statContainer?.lastSeven.stats[3],
              offensiveRebounds: entry.player?.statContainer?.lastSeven.stats[4],
              defensiveRebounds: entry.player?.statContainer?.lastSeven.stats[5],
              rebounds: entry.player?.statContainer?.lastSeven.stats[6],
              ejections: entry.player?.statContainer?.lastSeven.stats[7],
              flagrantFouls: entry.player?.statContainer?.lastSeven.stats[8],
              personalFouls: entry.player?.statContainer?.lastSeven.stats[9],
              technicalFouls: entry.player?.statContainer?.lastSeven.stats[10],
              turnovers: entry.player?.statContainer?.lastSeven.stats[11],
              idk: entry.player?.statContainer?.lastSeven.stats[12],
              fieldGoalsMade: entry.player?.statContainer?.lastSeven.stats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.lastSeven.stats[14],
              freeThrowsMade: entry.player?.statContainer?.lastSeven.stats[15],
              freeThrowsAttempted: entry.player?.statContainer?.lastSeven.stats[16],
              threePointersMade: entry.player?.statContainer?.lastSeven.stats[17],
              threePointersAttempted: entry.player?.statContainer?.lastSeven.stats[18],
              fieldGoalPercentage: entry.player?.statContainer?.lastSeven.stats[19],
              freeThrowPercentage: entry.player?.statContainer?.lastSeven.stats[20],
              threePointPercentage: entry.player?.statContainer?.lastSeven.stats[21],
              minutesPerGame: entry.player?.statContainer?.lastSeven.stats[28],
              gamesPlayed: entry.player?.statContainer?.lastSeven.stats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerRankingsList7.push(playerRanking7);
          }


          if (entry.player?.statContainer?.prevSeason) {
            const playerRankingPrev: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsCurr.positionalRanking,
              totalRanking: entry.ratings?.ratingsCurr.totalRanking,
              totalRating: entry.ratings?.ratingsCurr.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.prevSeason.stats[0],
              blocks: entry.player?.statContainer?.prevSeason.stats[1],
              steals: entry.player?.statContainer?.prevSeason.stats[2],
              assists: entry.player?.statContainer?.prevSeason.stats[3],
              offensiveRebounds: entry.player?.statContainer?.prevSeason.stats[4],
              defensiveRebounds: entry.player?.statContainer?.prevSeason.stats[5],
              rebounds: entry.player?.statContainer?.prevSeason.stats[6],
              ejections: entry.player?.statContainer?.prevSeason.stats[7],
              flagrantFouls: entry.player?.statContainer?.prevSeason.stats[8],
              personalFouls: entry.player?.statContainer?.prevSeason.stats[9],
              technicalFouls: entry.player?.statContainer?.prevSeason.stats[10],
              turnovers: entry.player?.statContainer?.prevSeason.stats[11],
              idk: entry.player?.statContainer?.prevSeason.stats[12],
              fieldGoalsMade: entry.player?.statContainer?.prevSeason.stats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.prevSeason.stats[14],
              freeThrowsMade: entry.player?.statContainer?.prevSeason.stats[15],
              freeThrowsAttempted: entry.player?.statContainer?.prevSeason.stats[16],
              threePointersMade: entry.player?.statContainer?.prevSeason.stats[17],
              threePointersAttempted: entry.player?.statContainer?.prevSeason.stats[18],
              fieldGoalPercentage: entry.player?.statContainer?.prevSeason.stats[19],
              freeThrowPercentage: entry.player?.statContainer?.prevSeason.stats[20],
              threePointPercentage: entry.player?.statContainer?.prevSeason.stats[21],
              minutesPerGame: entry.player?.statContainer?.prevSeason.stats[28],
              gamesPlayed: entry.player?.statContainer?.prevSeason.stats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerRankingsListPrev.push(playerRankingPrev);
          }


          if (entry.player?.statContainer?.lastThirty) {
            const playerRanking30: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsPrev30.positionalRanking,
              totalRanking: entry.ratings?.ratingsPrev30.totalRanking,
              totalRating: entry.ratings?.ratingsPrev30.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.lastThirty.stats[0],
              blocks: entry.player?.statContainer?.lastThirty.stats[1],
              steals: entry.player?.statContainer?.lastThirty.stats[2],
              assists: entry.player?.statContainer?.lastThirty.stats[3],
              offensiveRebounds: entry.player?.statContainer?.lastThirty.stats[4],
              defensiveRebounds: entry.player?.statContainer?.lastThirty.stats[5],
              rebounds: entry.player?.statContainer?.lastThirty.stats[6],
              ejections: entry.player?.statContainer?.lastThirty.stats[7],
              flagrantFouls: entry.player?.statContainer?.lastThirty.stats[8],
              personalFouls: entry.player?.statContainer?.lastThirty.stats[9],
              technicalFouls: entry.player?.statContainer?.lastThirty.stats[10],
              turnovers: entry.player?.statContainer?.lastThirty.stats[11],
              idk: entry.player?.statContainer?.lastThirty.stats[12],
              fieldGoalsMade: entry.player?.statContainer?.lastThirty.stats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.lastThirty.stats[14],
              freeThrowsMade: entry.player?.statContainer?.lastThirty.stats[15],
              freeThrowsAttempted: entry.player?.statContainer?.lastThirty.stats[16],
              threePointersMade: entry.player?.statContainer?.lastThirty.stats[17],
              threePointersAttempted: entry.player?.statContainer?.lastThirty.stats[18],
              fieldGoalPercentage: entry.player?.statContainer?.lastThirty.stats[19],
              freeThrowPercentage: entry.player?.statContainer?.lastThirty.stats[20],
              threePointPercentage: entry.player?.statContainer?.lastThirty.stats[21],
              minutesPerGame: entry.player?.statContainer?.lastThirty.stats[28],
              gamesPlayed: entry.player?.statContainer?.lastThirty.stats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerRankingsList30.push(playerRanking30);
          }
          if (entry.player?.statContainer?.seasonProjections) {
            const playerRankingProj: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsCurr.positionalRanking,
              totalRanking: entry.ratings?.ratingsCurr.totalRanking,
              totalRating: entry.ratings?.ratingsCurr.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.seasonProjections.stats[0],
              blocks: entry.player?.statContainer?.seasonProjections.stats[1],
              steals: entry.player?.statContainer?.seasonProjections.stats[2],
              assists: entry.player?.statContainer?.seasonProjections.stats[3],
              offensiveRebounds: entry.player?.statContainer?.seasonProjections.stats[4],
              defensiveRebounds: entry.player?.statContainer?.seasonProjections.stats[5],
              rebounds: entry.player?.statContainer?.seasonProjections.stats[6],
              ejections: entry.player?.statContainer?.seasonProjections.stats[7],
              flagrantFouls: entry.player?.statContainer?.seasonProjections.stats[8],
              personalFouls: entry.player?.statContainer?.seasonProjections.stats[9],
              technicalFouls: entry.player?.statContainer?.seasonProjections.stats[10],
              turnovers: entry.player?.statContainer?.seasonProjections.stats[11],
              idk: entry.player?.statContainer?.seasonProjections.stats[12],
              fieldGoalsMade: entry.player?.statContainer?.seasonProjections.stats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.seasonProjections.stats[14],
              freeThrowsMade: entry.player?.statContainer?.seasonProjections.stats[15],
              freeThrowsAttempted: entry.player?.statContainer?.seasonProjections.stats[16],
              threePointersMade: entry.player?.statContainer?.seasonProjections.stats[17],
              threePointersAttempted: entry.player?.statContainer?.seasonProjections.stats[18],
              fieldGoalPercentage: entry.player?.statContainer?.seasonProjections.stats[19],
              freeThrowPercentage: entry.player?.statContainer?.seasonProjections.stats[20],
              threePointPercentage: entry.player?.statContainer?.seasonProjections.stats[21],
              minutesPerGame: entry.player?.statContainer?.seasonProjections.stats[28],
              gamesPlayed: entry.player?.statContainer?.seasonProjections.stats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerRankingsListProj.push(playerRankingProj);
          }


          if (entry.player?.statContainer?.prevSeasonProjections) {
            const playerRankingPrevProj: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsCurr.positionalRanking,
              totalRanking: entry.ratings?.ratingsCurr.totalRanking,
              totalRating: entry.ratings?.ratingsCurr.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.prevSeasonProjections.stats[0],
              blocks: entry.player?.statContainer?.prevSeasonProjections.stats[1],
              steals: entry.player?.statContainer?.prevSeasonProjections.stats[2],
              assists: entry.player?.statContainer?.prevSeasonProjections.stats[3],
              offensiveRebounds: entry.player?.statContainer?.prevSeasonProjections.stats[4],
              defensiveRebounds: entry.player?.statContainer?.prevSeasonProjections.stats[5],
              rebounds: entry.player?.statContainer?.prevSeasonProjections.stats[6],
              ejections: entry.player?.statContainer?.prevSeasonProjections.stats[7],
              flagrantFouls: entry.player?.statContainer?.prevSeasonProjections.stats[8],
              personalFouls: entry.player?.statContainer?.prevSeasonProjections.stats[9],
              technicalFouls: entry.player?.statContainer?.prevSeasonProjections.stats[10],
              turnovers: entry.player?.statContainer?.prevSeasonProjections.stats[11],
              idk: entry.player?.statContainer?.prevSeasonProjections.stats[12],
              fieldGoalsMade: entry.player?.statContainer?.prevSeasonProjections.stats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.prevSeasonProjections.stats[14],
              freeThrowsMade: entry.player?.statContainer?.prevSeasonProjections.stats[15],
              freeThrowsAttempted: entry.player?.statContainer?.prevSeasonProjections.stats[16],
              threePointersMade: entry.player?.statContainer?.prevSeasonProjections.stats[17],
              threePointersAttempted: entry.player?.statContainer?.prevSeasonProjections.stats[18],
              fieldGoalPercentage: entry.player?.statContainer?.prevSeasonProjections.stats[19],
              freeThrowPercentage: entry.player?.statContainer?.prevSeasonProjections.stats[20],
              threePointPercentage: entry.player?.statContainer?.prevSeasonProjections.stats[21],
              minutesPerGame: entry.player?.statContainer?.prevSeasonProjections.stats[28],
              gamesPlayed: entry.player?.statContainer?.prevSeasonProjections.stats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerRankingsListPrevProj.push(playerRankingPrevProj);
          }


          // AVERAGES
          if (entry.player?.statContainer?.currentSeason?.averageStats) {
            const playerAvgRankingCurr: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsCurr.positionalRanking,
              totalRanking: entry.ratings?.ratingsCurr.totalRanking,
              totalRating: entry.ratings?.ratingsCurr.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.currentSeason.averageStats[0],
              blocks: entry.player?.statContainer?.currentSeason.averageStats[1],
              steals: entry.player?.statContainer?.currentSeason.averageStats[2],
              assists: entry.player?.statContainer?.currentSeason.averageStats[3],
              offensiveRebounds: entry.player?.statContainer?.currentSeason.averageStats[4],
              defensiveRebounds: entry.player?.statContainer?.currentSeason.averageStats[5],
              rebounds: entry.player?.statContainer?.currentSeason.averageStats[6],
              ejections: entry.player?.statContainer?.currentSeason.averageStats[7],
              flagrantFouls: entry.player?.statContainer?.currentSeason.averageStats[8],
              personalFouls: entry.player?.statContainer?.currentSeason.averageStats[9],
              technicalFouls: entry.player?.statContainer?.currentSeason.averageStats[10],
              turnovers: entry.player?.statContainer?.currentSeason.averageStats[11],
              idk: entry.player?.statContainer?.currentSeason.averageStats[12],
              fieldGoalsMade: entry.player?.statContainer?.currentSeason.averageStats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.currentSeason.averageStats[14],
              freeThrowsMade: entry.player?.statContainer?.currentSeason.averageStats[15],
              freeThrowsAttempted: entry.player?.statContainer?.currentSeason.averageStats[16],
              threePointersMade: entry.player?.statContainer?.currentSeason.averageStats[17],
              threePointersAttempted: entry.player?.statContainer?.currentSeason.averageStats[18],
              fieldGoalPercentage: entry.player?.statContainer?.currentSeason.averageStats[19],
              freeThrowPercentage: entry.player?.statContainer?.currentSeason.averageStats[20],
              threePointPercentage: entry.player?.statContainer?.currentSeason.averageStats[21],
              minutesPerGame: entry.player?.statContainer?.currentSeason.averageStats[28],
              gamesPlayed: entry.player?.statContainer?.currentSeason.averageStats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerAvgRankingsListCurr.push(playerAvgRankingCurr);
          }


          if (entry.player?.statContainer?.lastFifteen?.averageStats) {
            const playerAvgRanking15: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsPrev15.positionalRanking,
              totalRanking: entry.ratings?.ratingsPrev15.totalRanking,
              totalRating: entry.ratings?.ratingsPrev15.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.lastFifteen.averageStats[0],
              blocks: entry.player?.statContainer?.lastFifteen.averageStats[1],
              steals: entry.player?.statContainer?.lastFifteen.averageStats[2],
              assists: entry.player?.statContainer?.lastFifteen.averageStats[3],
              offensiveRebounds: entry.player?.statContainer?.lastFifteen.averageStats[4],
              defensiveRebounds: entry.player?.statContainer?.lastFifteen.averageStats[5],
              rebounds: entry.player?.statContainer?.lastFifteen.averageStats[6],
              ejections: entry.player?.statContainer?.lastFifteen.averageStats[7],
              flagrantFouls: entry.player?.statContainer?.lastFifteen.averageStats[8],
              personalFouls: entry.player?.statContainer?.lastFifteen.averageStats[9],
              technicalFouls: entry.player?.statContainer?.lastFifteen.averageStats[10],
              turnovers: entry.player?.statContainer?.lastFifteen.averageStats[11],
              idk: entry.player?.statContainer?.lastFifteen.averageStats[12],
              fieldGoalsMade: entry.player?.statContainer?.lastFifteen.averageStats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.lastFifteen.averageStats[14],
              freeThrowsMade: entry.player?.statContainer?.lastFifteen.averageStats[15],
              freeThrowsAttempted: entry.player?.statContainer?.lastFifteen.averageStats[16],
              threePointersMade: entry.player?.statContainer?.lastFifteen.averageStats[17],
              threePointersAttempted: entry.player?.statContainer?.lastFifteen.averageStats[18],
              fieldGoalPercentage: entry.player?.statContainer?.lastFifteen.averageStats[19],
              freeThrowPercentage: entry.player?.statContainer?.lastFifteen.averageStats[20],
              threePointPercentage: entry.player?.statContainer?.lastFifteen.averageStats[21],
              minutesPerGame: entry.player?.statContainer?.lastFifteen.averageStats[28],
              gamesPlayed: entry.player?.statContainer?.lastFifteen.averageStats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerAvgRankingsList15.push(playerAvgRanking15);
          }


          if (entry.player?.statContainer?.lastSeven?.averageStats) {
            const playerAvgRanking7: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsPrev7.positionalRanking,
              totalRanking: entry.ratings?.ratingsPrev7.totalRanking,
              totalRating: entry.ratings?.ratingsPrev7.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.lastSeven.averageStats[0],
              blocks: entry.player?.statContainer?.lastSeven.averageStats[1],
              steals: entry.player?.statContainer?.lastSeven.averageStats[2],
              assists: entry.player?.statContainer?.lastSeven.averageStats[3],
              offensiveRebounds: entry.player?.statContainer?.lastSeven.averageStats[4],
              defensiveRebounds: entry.player?.statContainer?.lastSeven.averageStats[5],
              rebounds: entry.player?.statContainer?.lastSeven.averageStats[6],
              ejections: entry.player?.statContainer?.lastSeven.averageStats[7],
              flagrantFouls: entry.player?.statContainer?.lastSeven.averageStats[8],
              personalFouls: entry.player?.statContainer?.lastSeven.averageStats[9],
              technicalFouls: entry.player?.statContainer?.lastSeven.averageStats[10],
              turnovers: entry.player?.statContainer?.lastSeven.averageStats[11],
              idk: entry.player?.statContainer?.lastSeven.averageStats[12],
              fieldGoalsMade: entry.player?.statContainer?.lastSeven.averageStats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.lastSeven.averageStats[14],
              freeThrowsMade: entry.player?.statContainer?.lastSeven.averageStats[15],
              freeThrowsAttempted: entry.player?.statContainer?.lastSeven.averageStats[16],
              threePointersMade: entry.player?.statContainer?.lastSeven.averageStats[17],
              threePointersAttempted: entry.player?.statContainer?.lastSeven.averageStats[18],
              fieldGoalPercentage: entry.player?.statContainer?.lastSeven.averageStats[19],
              freeThrowPercentage: entry.player?.statContainer?.lastSeven.averageStats[20],
              threePointPercentage: entry.player?.statContainer?.lastSeven.averageStats[21],
              minutesPerGame: entry.player?.statContainer?.lastSeven.averageStats[28],
              gamesPlayed: entry.player?.statContainer?.lastSeven.averageStats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerAvgRankingsList7.push(playerAvgRanking7);
          }


          if (entry.player?.statContainer?.prevSeason?.averageStats) {
            const playerAvgRankingPrev: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsCurr.positionalRanking,
              totalRanking: entry.ratings?.ratingsCurr.totalRanking,
              totalRating: entry.ratings?.ratingsCurr.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.prevSeason.averageStats[0],
              blocks: entry.player?.statContainer?.prevSeason.averageStats[1],
              steals: entry.player?.statContainer?.prevSeason.averageStats[2],
              assists: entry.player?.statContainer?.prevSeason.averageStats[3],
              offensiveRebounds: entry.player?.statContainer?.prevSeason.averageStats[4],
              defensiveRebounds: entry.player?.statContainer?.prevSeason.averageStats[5],
              rebounds: entry.player?.statContainer?.prevSeason.averageStats[6],
              ejections: entry.player?.statContainer?.prevSeason.averageStats[7],
              flagrantFouls: entry.player?.statContainer?.prevSeason.averageStats[8],
              personalFouls: entry.player?.statContainer?.prevSeason.averageStats[9],
              technicalFouls: entry.player?.statContainer?.prevSeason.averageStats[10],
              turnovers: entry.player?.statContainer?.prevSeason.averageStats[11],
              idk: entry.player?.statContainer?.prevSeason.averageStats[12],
              fieldGoalsMade: entry.player?.statContainer?.prevSeason.averageStats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.prevSeason.averageStats[14],
              freeThrowsMade: entry.player?.statContainer?.prevSeason.averageStats[15],
              freeThrowsAttempted: entry.player?.statContainer?.prevSeason.averageStats[16],
              threePointersMade: entry.player?.statContainer?.prevSeason.averageStats[17],
              threePointersAttempted: entry.player?.statContainer?.prevSeason.averageStats[18],
              fieldGoalPercentage: entry.player?.statContainer?.prevSeason.averageStats[19],
              freeThrowPercentage: entry.player?.statContainer?.prevSeason.averageStats[20],
              threePointPercentage: entry.player?.statContainer?.prevSeason.averageStats[21],
              minutesPerGame: entry.player?.statContainer?.prevSeason.averageStats[28],
              gamesPlayed: entry.player?.statContainer?.prevSeason.averageStats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerAvgRankingsListPrev.push(playerAvgRankingPrev);
          }


          if (entry.player?.statContainer?.lastThirty?.averageStats) {
            const playerAvgRanking30: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsPrev30.positionalRanking,
              totalRanking: entry.ratings?.ratingsPrev30.totalRanking,
              totalRating: entry.ratings?.ratingsPrev30.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.lastThirty.averageStats[0],
              blocks: entry.player?.statContainer?.lastThirty.averageStats[1],
              steals: entry.player?.statContainer?.lastThirty.averageStats[2],
              assists: entry.player?.statContainer?.lastThirty.averageStats[3],
              offensiveRebounds: entry.player?.statContainer?.lastThirty.averageStats[4],
              defensiveRebounds: entry.player?.statContainer?.lastThirty.averageStats[5],
              rebounds: entry.player?.statContainer?.lastThirty.averageStats[6],
              ejections: entry.player?.statContainer?.lastThirty.averageStats[7],
              flagrantFouls: entry.player?.statContainer?.lastThirty.averageStats[8],
              personalFouls: entry.player?.statContainer?.lastThirty.averageStats[9],
              technicalFouls: entry.player?.statContainer?.lastThirty.averageStats[10],
              turnovers: entry.player?.statContainer?.lastThirty.averageStats[11],
              idk: entry.player?.statContainer?.lastThirty.averageStats[12],
              fieldGoalsMade: entry.player?.statContainer?.lastThirty.averageStats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.lastThirty.averageStats[14],
              freeThrowsMade: entry.player?.statContainer?.lastThirty.averageStats[15],
              freeThrowsAttempted: entry.player?.statContainer?.lastThirty.averageStats[16],
              threePointersMade: entry.player?.statContainer?.lastThirty.averageStats[17],
              threePointersAttempted: entry.player?.statContainer?.lastThirty.averageStats[18],
              fieldGoalPercentage: entry.player?.statContainer?.lastThirty.averageStats[19],
              freeThrowPercentage: entry.player?.statContainer?.lastThirty.averageStats[20],
              threePointPercentage: entry.player?.statContainer?.lastThirty.averageStats[21],
              minutesPerGame: entry.player?.statContainer?.lastThirty.averageStats[28],
              gamesPlayed: entry.player?.statContainer?.lastThirty.averageStats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerAvgRankingsList30.push(playerAvgRanking30);
          }
          if (entry.player?.statContainer?.seasonProjections?.averageStats) {
            const playerAvgRankingProj: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsCurr.positionalRanking,
              totalRanking: entry.ratings?.ratingsCurr.totalRanking,
              totalRating: entry.ratings?.ratingsCurr.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.seasonProjections.averageStats[0],
              blocks: entry.player?.statContainer?.seasonProjections.averageStats[1],
              steals: entry.player?.statContainer?.seasonProjections.averageStats[2],
              assists: entry.player?.statContainer?.seasonProjections.averageStats[3],
              offensiveRebounds: entry.player?.statContainer?.seasonProjections.averageStats[4],
              defensiveRebounds: entry.player?.statContainer?.seasonProjections.averageStats[5],
              rebounds: entry.player?.statContainer?.seasonProjections.averageStats[6],
              ejections: entry.player?.statContainer?.seasonProjections.averageStats[7],
              flagrantFouls: entry.player?.statContainer?.seasonProjections.averageStats[8],
              personalFouls: entry.player?.statContainer?.seasonProjections.averageStats[9],
              technicalFouls: entry.player?.statContainer?.seasonProjections.averageStats[10],
              turnovers: entry.player?.statContainer?.seasonProjections.averageStats[11],
              idk: entry.player?.statContainer?.seasonProjections.averageStats[12],
              fieldGoalsMade: entry.player?.statContainer?.seasonProjections.averageStats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.seasonProjections.averageStats[14],
              freeThrowsMade: entry.player?.statContainer?.seasonProjections.averageStats[15],
              freeThrowsAttempted: entry.player?.statContainer?.seasonProjections.averageStats[16],
              threePointersMade: entry.player?.statContainer?.seasonProjections.averageStats[17],
              threePointersAttempted: entry.player?.statContainer?.seasonProjections.averageStats[18],
              fieldGoalPercentage: entry.player?.statContainer?.seasonProjections.averageStats[19],
              freeThrowPercentage: entry.player?.statContainer?.seasonProjections.averageStats[20],
              threePointPercentage: entry.player?.statContainer?.seasonProjections.averageStats[21],
              minutesPerGame: entry.player?.statContainer?.seasonProjections.averageStats[28],
              gamesPlayed: entry.player?.statContainer?.seasonProjections.averageStats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerAvgRankingsListProj.push(playerAvgRankingProj);
          }


          if (entry.player?.statContainer?.prevSeasonProjections?.averageStats) {
            const playerAvgRankingPrevProj: PlayerRanking = {
              id: entry.id,
              onTeamId: entry.onTeamId,
              proTeamId: entry.player?.proTeamId,
              defaultPositionId: entry.player?.defaultPositionId,
              positionalRankings: entry.ratings?.ratingsCurr.positionalRanking,
              totalRanking: entry.ratings?.ratingsCurr.totalRanking,
              totalRating: entry.ratings?.ratingsCurr.totalRating,
              fullName: entry.player?.fullName,
              points: entry.player?.statContainer?.prevSeasonProjections.averageStats[0],
              blocks: entry.player?.statContainer?.prevSeasonProjections.averageStats[1],
              steals: entry.player?.statContainer?.prevSeasonProjections.averageStats[2],
              assists: entry.player?.statContainer?.prevSeasonProjections.averageStats[3],
              offensiveRebounds: entry.player?.statContainer?.prevSeasonProjections.averageStats[4],
              defensiveRebounds: entry.player?.statContainer?.prevSeasonProjections.averageStats[5],
              rebounds: entry.player?.statContainer?.prevSeasonProjections.averageStats[6],
              ejections: entry.player?.statContainer?.prevSeasonProjections.averageStats[7],
              flagrantFouls: entry.player?.statContainer?.prevSeasonProjections.averageStats[8],
              personalFouls: entry.player?.statContainer?.prevSeasonProjections.averageStats[9],
              technicalFouls: entry.player?.statContainer?.prevSeasonProjections.averageStats[10],
              turnovers: entry.player?.statContainer?.prevSeasonProjections.averageStats[11],
              idk: entry.player?.statContainer?.prevSeasonProjections.averageStats[12],
              fieldGoalsMade: entry.player?.statContainer?.prevSeasonProjections.averageStats[13],
              fieldGoalsAttempted: entry.player?.statContainer?.prevSeasonProjections.averageStats[14],
              freeThrowsMade: entry.player?.statContainer?.prevSeasonProjections.averageStats[15],
              freeThrowsAttempted: entry.player?.statContainer?.prevSeasonProjections.averageStats[16],
              threePointersMade: entry.player?.statContainer?.prevSeasonProjections.averageStats[17],
              threePointersAttempted: entry.player?.statContainer?.prevSeasonProjections.averageStats[18],
              fieldGoalPercentage: entry.player?.statContainer?.prevSeasonProjections.averageStats[19],
              freeThrowPercentage: entry.player?.statContainer?.prevSeasonProjections.averageStats[20],
              threePointPercentage: entry.player?.statContainer?.prevSeasonProjections.averageStats[21],
              minutesPerGame: entry.player?.statContainer?.prevSeasonProjections.averageStats[28],
              gamesPlayed: entry.player?.statContainer?.prevSeasonProjections.averageStats[42],
              adp: entry.player?.ownership?.averageDraftPosition,
              eligiblePositionNames: this.mapEligiblePositions(entry.player?.eligibleSlots),
            }
            playerAvgRankingsListPrevProj.push(playerAvgRankingPrevProj);
          }
        }
      })
      // TOTALS
      this.playerRankingsDataCurr = playerRankingsListCurr;
      this.playerRankingsData7 = playerRankingsList7;
      this.playerRankingsData15 = playerRankingsList15;
      this.playerRankingsData30 = playerRankingsList30;
      this.playerRankingsDataPrev = playerRankingsListPrev;
      this.playerRankingsDataProj = playerRankingsListProj;
      this.playerRankingsDataPrevProj = playerRankingsListPrevProj;


      // AVERAGES
      this.playerAvgRankingsDataCurr = playerAvgRankingsListCurr;
      this.playerAvgRankingsData7 = playerAvgRankingsList7;
      this.playerAvgRankingsData15 = playerAvgRankingsList15;
      this.playerAvgRankingsData30 = playerAvgRankingsList30;
      this.playerAvgRankingsDataPrev = playerAvgRankingsListPrev;
      this.playerAvgRankingsDataProj = playerAvgRankingsListProj;
      this.playerAvgRankingsDataPrevProj = playerAvgRankingsListPrevProj;

      this.displayedData = playerAvgRankingsListCurr;
      this.cdr.detectChanges();
    });
  }


  onDataSourceChange($event: any) {
    if (this.basedOn === 'Totals') {
      switch ($event.value) {
        case (0): {
          this.displayedData = this.playerRankingsDataCurr;
          break;
        }
        case (1): {
          this.displayedData = this.playerRankingsData7;
          break;
        }
        case (2): {
          this.displayedData = this.playerRankingsData15;
          break;
        }
        case (3): {
          this.displayedData = this.playerRankingsData30;
          break;
        }
        case (4): {
          this.displayedData = this.playerRankingsDataPrev;
          break;
        }
        case (5): {
          this.displayedData = this.playerRankingsDataProj;
          break;
        }
        case (6): {
          this.displayedData = this.playerRankingsDataPrevProj;
          break;
        }
        default: {
          this.displayedData = this.playerRankingsDataCurr;
          break;
        }
      }
    }


    if (this.basedOn === 'Averages') {
      switch ($event.value) {
        case (0): {
          this.displayedData = this.playerAvgRankingsDataCurr;
          break;
        }
        case (1): {
          this.displayedData = this.playerAvgRankingsData7;
          break;
        }
        case (2): {
          this.displayedData = this.playerAvgRankingsData15;
          break;
        }
        case (3): {
          this.displayedData = this.playerAvgRankingsData30;
          break;
        }
        case (4): {
          this.displayedData = this.playerAvgRankingsDataPrev;
          break;
        }
        case (5): {
          this.displayedData = this.playerAvgRankingsDataProj;
          break;
        }
        case (6): {
          this.displayedData = this.playerAvgRankingsDataPrevProj;
          break;
        }
        default: {
          this.displayedData = this.playerAvgRankingsDataCurr;
          break;
        }
      }
    }

    // Changes color of table
    this.determineColorTable(); 

    // Emits for the team component
    if (this.source === 'team') {
      this.dataSourceChangeEvent.emit();
    }
  }


  onAverageOrTotalChange($event: any) {
    if ($event.value === 'Totals') {
      switch (this.selectedDataSource) {
        case (0): {
          this.displayedData = this.playerRankingsDataCurr;
          break;
        }
        case (1): {
          this.displayedData = this.playerRankingsData7;
          break;
        }
        case (2): {
          this.displayedData = this.playerRankingsData15;
          break;
        }
        case (3): {
          this.displayedData = this.playerRankingsData30;
          break;
        }
        case (4): {
          this.displayedData = this.playerRankingsDataPrev;
          break;
        }
        case (5): {
          this.displayedData = this.playerRankingsDataProj;
          break;
        }
        case (6): {
          this.displayedData = this.playerRankingsDataPrevProj;
          break;
        }
        default: {
          this.displayedData = this.playerRankingsDataCurr;
          break;
        }
      }
    }


    if ($event.value === 'Averages') {
      switch (this.selectedDataSource) {
        case (0): {
          this.displayedData = this.playerAvgRankingsDataCurr;
          break;
        }
        case (1): {
          this.displayedData = this.playerAvgRankingsData7;
          break;
        }
        case (2): {
          this.displayedData = this.playerAvgRankingsData15;
          break;
        }
        case (3): {
          this.displayedData = this.playerAvgRankingsData30;
          break;
        }
        case (4): {
          this.displayedData = this.playerAvgRankingsDataPrev;
          break;
        }
        case (5): {
          this.displayedData = this.playerAvgRankingsDataProj;
          break;
        }
        case (6): {
          this.displayedData = this.playerAvgRankingsDataPrevProj;
          break;
        }
        default: {
          this.displayedData = this.playerAvgRankingsDataCurr;
          break;
        }
      }
    }

    // Changes color of table
    this.determineColorTable();


    // Emits for the team component
    if (this.source === 'team') {
      this.dataSourceChangeEvent.emit();
    }
  }


  private initColumns(): void  {
    this.tableColumns = [
      {
        name: 'R#',
        dataKey: 'totalRanking',
        isViewable: true,
      },
      {
        name: 'Pos #',
        dataKey: 'positionalRankings',
        isViewable: false,
      },
      {
        name: 'Full Name',
        dataKey: 'fullName',
        isViewable: true,
      },
      {
        name: 'Pos',
        dataKey: 'eligiblePositionNames',
        isViewable: true,
      },
      // {
      //   name: 'Position',
      //   dataKey: 'defaultPositionId',
      //   isViewable: true,
      // },
      {
        name: 'Team',
        dataKey: 'proTeamId',
        isViewable: true,
      },
      {
        name: 'Owner',
        dataKey: 'onTeamId',
        isViewable: false,
      },
      {
        name: 'GP',
        dataKey: 'gamesPlayed',
        isViewable: true,
      },
      {
        name: 'MPG',
        dataKey: 'minutesPerGame',
        inputType: 'float',
        isViewable: true,
      },
      {
        name: 'FG%',
        dataKey: 'fieldGoalPercentage',
        inputType: 'percentage',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'FT%',
        dataKey: 'freeThrowPercentage',
        inputType: 'percentage',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'PTS',
        dataKey: 'points',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'REB',
        dataKey: 'rebounds',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'AST',
        dataKey: 'assists',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'BLK',
        dataKey: 'blocks',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'STL',
        dataKey: 'steals',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: '3PM',
        dataKey: 'threePointersMade',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'TOs',
        dataKey: 'turnovers',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'OREB',
        dataKey: 'offensiveRebounds',
        inputType: 'float',
        isViewable: false,
        hasTotal: true
      },
      {
        name: 'DREB',
        dataKey: 'defensiveRebounds',
        inputType: 'float',
        isViewable: false,
        hasTotal: true
      },
      {
        name: 'FGM',
        dataKey: 'fieldGoalsMade',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'FGA',
        dataKey: 'fieldGoalsAttempted',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'FTM',
        dataKey: 'freeThrowsMade',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: 'FTA',
        dataKey: 'freeThrowsAttempted',
        inputType: 'float',
        isViewable: true,
        hasTotal: true
      },
      {
        name: '3PA',
        dataKey: 'threePointersAttempted',
        inputType: 'float',
        isViewable: false,
        hasTotal: true
      },
      {
        name: 'FFs',
        dataKey: 'flagrantFouls',
        inputType: 'float',
        isViewable: false,
        hasTotal: true
      },
      {
        name: 'PFs',
        dataKey: 'personalFouls',
        inputType: 'float',
        isViewable: false,
        hasTotal: true
      },
      {
        name: 'TFs',
        dataKey: 'technicalFouls',
        inputType: 'float',
        isViewable: false,
        hasTotal: true
      },
      {
        name: 'ADP',
        dataKey: 'adp',
        inputType: 'float',
        isViewable: true,
      },
      {
        name: 'Rating',
        dataKey: 'totalRating',
        inputType: 'float',
        isViewable: true,
      },
    ];
  }
}
