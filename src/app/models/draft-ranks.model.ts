export interface LeagueType {
    'ROTO': DraftRanks;
    'STANDARD': DraftRanks;
};

export interface DraftRanks {
    'auctionValue': number;
    'published': boolean;
    'rank': number;
    'rankSourceId': number;
    'rankType': string;
    'slotId': number;
};

