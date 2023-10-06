import { SeasonalStats } from "./seasonal-stats.model";


export interface StatContainer {
    currentSeason: SeasonalStats;
    lastFifteen: SeasonalStats;
    lastSeven: SeasonalStats;
    prevSeason: SeasonalStats;
    lastThirty: SeasonalStats;
    seasonProjections: SeasonalStats;
    prevSeasonProjections: SeasonalStats;
};
