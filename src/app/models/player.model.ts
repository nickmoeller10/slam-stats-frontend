import { DraftRanks, LeagueType } from "./draft-ranks.model";
import { Ownership } from "./ownership.model";
import { RatingsContainer } from "./ratings-container.model";
import { StatContainer } from "./stats-container.model";

export interface Player {
    active?: boolean;
    defaultPositionId?: number;
    defaultPositionName?: string;
    eligiblePositionNames?: string;
    draftRanksByRankType?: LeagueType;
    droppable?: boolean;
    eligibleSlots?: number[];
    firstName?: string;
    fullName?: string;
    onTeamId?: string; //NEED
    id?: number;
    injured?: boolean;
    injuryStatus?: string;
    jersey?: string;
    lastName?: string;
    lastNewsDate?: number;
    lastVideoDate?: number;
    ownership?: Ownership;
    ratings?: RatingsContainer;
    proTeamId?: string;
    seasonOutlook?: string;
    statContainer?: StatContainer;
    posRank?: number;
    totalRank?: number;
    rating?: number;
    teamStatus?: number;
   // keeperCurrVal?: number; Don't know what this value represents
    roundSelected?: number; // Based on keeperFutureVal
    acquisitionType?: string;
    adp?: number;
    percentOwned?: number;
    percentStarted?: number;
}
