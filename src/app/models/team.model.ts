export interface Team {
    abbrev: string,
    playoffSeed: number,
    name: string,
    id: number,
    logo: string,
    wins: number,
    losses: number,
    ties: number,
    percentage: number,
    points: number;
    blocks: number;
    steals: number;
    assists: number;
    rebounds: number;
    games: number; //42
    turnovers: number;
    fieldGoalsMade: number;
    fieldGoalsAttempted: number;
    freeThrowsMade: number;
    freeThrowsAttempted: number;
    threePointersMade: number;
    //threePointersAttempted: number; //18
    fieldGoalPercentage: number;
    freeThrowPercentage: number;
    //waiverRank: number;
};
