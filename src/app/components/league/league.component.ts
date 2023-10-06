import { JsonPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlayerService } from '../../services/player.service';
import { TeamComponent } from '../team/team.component';
import { PlayerContainer } from 'src/app/models/player-container.model';
import { TableColumn } from 'src/app/models/table-column.model';
import { Team } from 'src/app/models/team.model';


@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit {


  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<PlayerContainer> = new MatTableDataSource<PlayerContainer>();


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  public leagueInfo: Team[] = [];
  public tableColumns: TableColumn[] = [];


  constructor(private readonly playerService: PlayerService) {
  }


  ngOnInit(): void {
    this.getLeagueInfo();
    this.initColumns();
  }


  getLeagueInfo() {
    return this.playerService.getLeagueInfo().subscribe(res => {
      let teamList: Team[] = [];
      res.forEach(x => {
        const obj = JSON.parse(x)
        const team: Team = {
          abbrev: obj.abbrev,
          playoffSeed: obj.playoff_seed,
          name: obj.name,
          id: obj.id,
          logo: obj.logo,
          wins: obj.wins,
          losses: obj.losses,
          ties: obj.ties,
          percentage: this.convertToPercentage(obj.percentage),
          points: obj.points,
          blocks: obj.blocks,
          steals: obj.steals,
          assists: obj.assists,
          rebounds: obj.rebounds,
          games: obj.games,
          turnovers: obj.turnovers,
          fieldGoalsMade: obj.fgm,
          fieldGoalsAttempted: obj.fga,
          freeThrowsMade: obj.ftm,
          freeThrowsAttempted: obj.fta,
          threePointersMade: obj.threePointersMade,
          fieldGoalPercentage: this.convertToPercentage(obj.fgp),
          freeThrowPercentage: this.convertToPercentage(obj.ftp)
        }
        teamList.push(team)
      })
      this.leagueInfo = teamList;
    });
  }


  private convertToPercentage(value: number) {
    let num = value*100;
    num = Number(num.toPrecision(5));
    return num;
  }


  private initColumns(): void  {
    this.tableColumns = [
      {
        name: 'Rank',
        dataKey: 'playoffSeed'
      },
      {
        name: 'ABV',
        dataKey: 'abbrev'
      },
      {
        name: 'Team',
        dataKey: 'name'
      },
      
      {
        name: 'Wins',
        dataKey: 'wins'
      },
      {
        name: 'Losses',
        dataKey: 'losses'
      },
      {
        name: 'Ties',
        dataKey: 'ties'
      },
      {
        name: 'Win %',
        dataKey: 'percentage'
      },
      {
        name: 'Points',
        dataKey: 'points'
      },
      {
        name: 'Assists',
        dataKey: 'assists'
      },
      {
        name: 'Rebounds',
        dataKey: 'rebounds'
      },
      {
        name: 'Blocks',
        dataKey: 'blocks'
      },
      {
        name: 'Steals',
        dataKey: 'steals'
      },
      {
        name: 'FG%',
        dataKey: 'fieldGoalPercentage'
      },
      {
        name: 'FT%',
        dataKey: 'freeThrowPercentage'
      },
      {
        name: 'TOs',
        dataKey: 'turnovers'
      },
      {
        name: 'Games',
        dataKey: 'games'
      },
    ];
  }
}
