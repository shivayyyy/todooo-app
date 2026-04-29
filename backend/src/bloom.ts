import { BloomFilter } from 'bloom-filters';
import { User } from './models/User';

// Initialize a bloom filter with expected 100,000 items and a false positive rate of 1%
export let usernameBloomFilter = BloomFilter.create(100000, 0.01);

export const initializeBloomFilter = async () => {
  try {
    console.log('Initializing Username Bloom Filter...');
    const users = await User.find({}, { username: 1 }).lean();
    
    // Recreate the filter to clear it
    usernameBloomFilter = BloomFilter.create(100000, 0.01);
    
    users.forEach(u => {
      if (u.username) {
        usernameBloomFilter.add(u.username.toLowerCase());
      }
    });
    console.log(`Bloom filter loaded with ${users.length} usernames.`);
  } catch (error) {
    console.error('Failed to initialize Bloom filter', error);
  }
};

export const addUsernameToBloomFilter = (username: string) => {
  usernameBloomFilter.add(username.toLowerCase());
};

export const isUsernameTakenByBloomFilter = (username: string): boolean => {
  return usernameBloomFilter.has(username.toLowerCase());
};
