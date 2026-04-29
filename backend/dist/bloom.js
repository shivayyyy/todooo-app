"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsernameTakenByBloomFilter = exports.addUsernameToBloomFilter = exports.initializeBloomFilter = exports.usernameBloomFilter = void 0;
const bloom_filters_1 = require("bloom-filters");
const User_1 = require("./models/User");
// Initialize a bloom filter with expected 100,000 items and a false positive rate of 1%
exports.usernameBloomFilter = new bloom_filters_1.BloomFilter(100000, 0.01);
const initializeBloomFilter = async () => {
    try {
        console.log('Initializing Username Bloom Filter...');
        const users = await User_1.User.find({}, { username: 1 }).lean();
        // Recreate the filter to clear it
        exports.usernameBloomFilter = new bloom_filters_1.BloomFilter(100000, 0.01);
        users.forEach(u => {
            if (u.username) {
                exports.usernameBloomFilter.add(u.username.toLowerCase());
            }
        });
        console.log(`Bloom filter loaded with ${users.length} usernames.`);
    }
    catch (error) {
        console.error('Failed to initialize Bloom filter', error);
    }
};
exports.initializeBloomFilter = initializeBloomFilter;
const addUsernameToBloomFilter = (username) => {
    exports.usernameBloomFilter.add(username.toLowerCase());
};
exports.addUsernameToBloomFilter = addUsernameToBloomFilter;
const isUsernameTakenByBloomFilter = (username) => {
    return exports.usernameBloomFilter.has(username.toLowerCase());
};
exports.isUsernameTakenByBloomFilter = isUsernameTakenByBloomFilter;
