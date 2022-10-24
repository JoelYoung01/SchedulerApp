import { StorageService, Schedule } from "../../services/storageService";
import foragemock from "../../__mocks__/localforage";

test("storageService", async () => {
  //declare a dummy object for adding and removing to the storage
  let a = {};

  //declare a storage object
  let storage = new StorageService();

  //testing retrieving an item from storage
  foragemock.getItem.mockResolvedValueOnce(a);

  expect(await storage.read("item")).toBe(a);
  expect(foragemock.getItem.mock.calls).toEqual([["item"]]);

  //clearing out for the next test
  foragemock.getItem.mockClear();

  //testing saving an item to the storage
  foragemock.setItem.mockResolvedValueOnce(a);

  expect(storage.update("item", a)).toBe<void>(undefined);
  expect(foragemock.setItem.mock.calls).toEqual([["item", a]]);

  //clearing out for the next test
  foragemock.setItem.mockClear();

  //testing removing an item from the storage
  foragemock.removeItem.mockResolvedValueOnce(undefined);

  expect(storage.delete("item")).toBe<void>(undefined);
  expect(foragemock.removeItem.mock.calls).toEqual([["item"]]);

  //clearing out for next test
  foragemock.removeItem.mockClear();

  //testing retrieving all of the items from the storage
  foragemock.iterate.mockImplementationOnce(
    (f: (value: Schedule, key: string, _: number) => void) => {
      f(a, "item", 1);
      return Promise.resolve(undefined);
    }
  );

  expect(await storage.returnAll()).toStrictEqual<{ [key: string]: Schedule }>({
    item: a
  });
});

// test("delete item", async () => {
//   let a = {};
//   foragemock.removeItem.mockResolvedValue(a);

//   let storage = new StorageService();
//   expect(await storage.read("item")).toBe(a);
//   expect(foragemock.removeItem.mock.calls).toEqual([["item"]]);
// });
