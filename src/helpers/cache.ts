import NodeCache from 'node-cache';

// Creating a new cache instance
export const cache = new NodeCache({ stdTTL: 43200, checkperiod: 3600 });
// each cache is lasting 12hours and it is checked every 1 hour for removal