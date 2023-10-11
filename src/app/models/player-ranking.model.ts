export interface PlayerRanking {
    id?: number;
    onTeamId?: number;
    proTeamId?: string;
    defaultPositionId?: number;
    eligiblePositionNames?: string;
    positionalRankings?: number;
    statCategoryRankings?: number;
    totalRanking?: number;
    totalRating?: number;
    fullName?: string;
    points?: number; //0
    blocks?: number;
    steals?: number;
    assists?: number;
    offensiveRebounds?: number; //4
    defensiveRebounds?: number;
    rebounds?: number;
    ejections?: number;
    flagrantFouls?: number; //8
    personalFouls?: number;
    technicalFouls?: number;
    turnovers?: number; //11
    idk?: number //12
    fieldGoalsMade?: number;
    fieldGoalsAttempted?: number;
    freeThrowsMade?: number;
    freeThrowsAttempted?: number;
    threePointersMade?: number;
    threePointersAttempted?: number; //18
    fieldGoalPercentage?: number;
    freeThrowPercentage?: number;
    threePointPercentage?: number;
    minutesPerGame?: number //28
    gamesPlayed?: number //42
    adp?:  number
    ratingPerGame?: number;
};
