import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { PlayerContainer } from 'src/app/models/player-container.model';
import { Player } from 'src/app/models/player.model';
import { TableColumn } from 'src/app/models/table-column.model';
import { LeagueService } from 'src/app/services/league.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Output() responseEvent: EventEmitter<any> = new EventEmitter<any>();
  responseMessage = '';
  hasError = false;
  loading = false;
  displayedColumns: string[] = ['playerId', 'position', 'fullName', 'jersey', 'team'];
  dataSource: MatTableDataSource<PlayerContainer> = new MatTableDataSource<PlayerContainer>();
  leagueConfig = {
    swid: '',
    espn_s2: '',
    league_id: '',
    season: ''
  };
  leagueId: string = '277919';
  //otherId: string = '33707030';
  season: string = '2024';
  swid: string = '{9C2B13E7-C1C7-4734-9499-E8D8896E49CA}';
  espnS2: string = 'AEBMTvPLwna58wR7w7GScMEoMK5SZDdc0UZWs7yFVE6hWxPuRv%2BUa7EabE0jGEb9Ksp7hUIru%2BcmI8AsEPvzoqb2pWAMYJXpowcSZfywo%2Bcrq41TTGSoiEdxTjnjCjoebOYWtLCSagGUiVX8%2BWT94fDfbhFk5TEtreHgh8CF%2FMv95%2B31YjDZj9kwPDTif3MOSAL14IJi%2FCmmQbcMToWY9iIFw9sJ4ggCBg1Qea9bHSJ8%2FkVkXi0RCsn0Q9gQJhkqD9vJqodAE%2BWHwGqmvEa5hkpo%2Bqh4k%2FJLJD3p1wGaLN8SBQ%3D%3D';
//  others2: string = 'AECj%2FFRkE8Gws6WiW4ZxHdohJ9W2MklN9NenB9HIFmHA7MqfODnebLXRymHIwdRlb9R09lKUVDEvc40tAHfhokmRrEMGImunPE9YxSmLsbAevEzSQNMMydkCah40en1NY%2BUZ2DZuulkCcCrMQSPwII5v5icT2ZPvxhQxDESQ8mHzGeRBfm5UEzZoJV29lHPZvaGY6SOu7KcuvG8V2alCr3Eu1PoLkrjOI326c%2Fl%2FqbnTjya%2FzF%2F%2FvCUNWt8IAuTmo%2Fjx0HxJcV70LI3cOQ8B11Pt3YNDMsRi%2BC3UtASlA9JEeQ%3D%3D';


  // leagueId: string = '';
  // season: string = '';
  // swid: string = '';
  // espnS2: string = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  // public heroList: Hero[] = [];
  public displayCode = '';
  public fantasyStatTitles: any = [];
  public playerInfo: PlayerContainer[] = [];
  public playersList: Player[] = [];
  public tableColumns: TableColumn[] = [];


  constructor(private readonly playerService: PlayerService, private leagueService: LeagueService) {
    // Create 100 users
   // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));


    // Assign the data to the data source for the table to render
    //this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit(): void {
    //this.getFantasyStatTitles();
    this.initColumns();
    this.generateLeague(false);
  }
    
  // Function to update league configuration
  updateLeague() {
    this.loading = true; 
    this.leagueService.updateLeagueConfiguration(this.leagueConfig)
      .subscribe(
        data => {
        //  console.log('Configuration updated successfully');
          this.responseMessage = data.response.message;
          this.hasError = false;
          this.loading = false;
          // Reload the page
       //   window.location.reload();

        },
        error => {
          console.error('Error updating configuration', error);
          this.responseMessage = 'Failed to Create League';
          this.hasError = true;
          this.loading = false;
        }
      );
  }

  // Function to generate league configuration and call the update method
  generateLeague(clickedGenerate: boolean) {
    // Checks if we have cookies already
    const hasLocalStorage = localStorage.getItem('leagueId') && localStorage.getItem('season') && localStorage.getItem('swid') && localStorage.getItem('espnS2'); 
    if (hasLocalStorage && !clickedGenerate) {
      const storedLeagueId = localStorage.getItem('leagueId');
      const storedEspnS2 = localStorage.getItem('espnS2');
      const storedSwid = localStorage.getItem('swid');
      const storedSeason = localStorage.getItem('season');
      if (storedLeagueId !== null) {
        this.leagueConfig.league_id = storedLeagueId;
      }
      if (storedEspnS2 !== null) {
        this.leagueConfig.espn_s2 = storedEspnS2;
      }
      if (storedSwid !== null) {
        this.leagueConfig.swid = storedSwid;
      }
      if (storedSeason !== null) {
        this.leagueConfig.season = storedSeason;
      }
    } else {
      // Set the attributes needed for the backend API
      this.leagueConfig.swid = this.swid;
      this.leagueConfig.espn_s2 = this.espnS2;
      this.leagueConfig.league_id = this.leagueId;
      this.leagueConfig.season = this.season;
    }
    // Call the updateLeague function to send the data to the backend
    if (clickedGenerate) {
      this.updateLeague();
    }
  }


    getFantasyStatTitles() {
      return this.playerService.getFantasyStatTitles().subscribe(res => {
        this.fantasyStatTitles =  res;
      });
    }


    private initColumns(): void  {
      this.tableColumns = [
        {
          name: 'Player ID',
          dataKey: 'id'
        },
        {
          name: 'Position',
          dataKey: 'defaultPositionId',
        },
        {
          name: 'Full Name',
          dataKey: 'fullName',
        },
        {
          name: 'Jersey #',
          dataKey: 'jersey',
        },
        {
          name: 'Team',
          dataKey: 'proTeamId',
        },
      ];
    }
  }


  // function createPlayerModel(playerInfo: PlayerContainer[]): Player[] {
  //   let playersListTemp: Player[] = [];
  //   playerInfo.forEach(x => playersListTemp.push(...x.player))
  //   return playersListTemp;
  // }
