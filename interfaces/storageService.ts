/* Create a TS Service and interface that can save and retrieve schedule data by a given id or key (up to you, must be unique identifier)

Save data to browser storage, look into localforage npm package or related

include method for getting all local storage schedules

CRUD functionality for local storage with schedules */

import Scheduler from "../interfaces/scheduler";

interface StorageService {
  // getting specific schedule based on key data
  read: (name: string) => Promise<Scheduler | null>;
  // reading the schedule list and seeing if the current schedule is already in the storage
  // if it isnt then add the currently held schedule to the schedule list
  update: (name: string, val: Scheduler) => Promise<void>;

  // deleting a specific schedule list and seeing if the specified schedule is even in the storage
  delete: (name: string) => Promise<void>;

  // getting all of the schedules from the storage and returning them
  returnAll: () => Promise<{ [key: string]: Scheduler }>;
}

export default StorageService;
