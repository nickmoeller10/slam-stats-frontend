import { Player } from "./player.model";
import { RatingsContainer } from "./ratings-container.model";

export interface PlayerContainer {
    draftAuctionValue?: number;
    id?: number;
    keeperValue?: number;
    keeperValueFuture?: number;
    lineupLocked?: boolean;
    onTeamId?: number;
    player?: Player;
    ratings?: RatingsContainer;
    rosterLocked?: boolean;
    status?: string;
    tradeLocked?: boolean;
    waiverProcessDate?: number;
}
