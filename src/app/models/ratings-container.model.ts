import { Ratings } from "./ratings.model";


export interface RatingsContainer {
    ratingsCurr: Ratings;
    ratingsPrev7: Ratings;
    ratingsPrev15: Ratings;
    ratingsPrev30: Ratings;
}
