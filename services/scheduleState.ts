import { useState } from "react";
import { Color, Employee, Schedule, Shift, Time } from "../entities";
import { generate } from "./waveform_collapse";
import { or, log } from "./util";

interface Add {
  add: Employee | Shift;
}

interface Remove {
  remove: Employee | Shift;
}

interface UpdateEmployee {
  update: Employee;
  color?: Color;
  name?: string;
  maxHours?: number;
  minHours?: number;
}

interface UpdateShift {
  update: Shift;
  name?: string;
  start?: Time;
  end?: Time;
}

interface UpdateBase {
  update: "default";
  maxHours?: number;
  minHours?: number;
}

export type ScheduleAction =
  | Add
  | Remove
  | UpdateEmployee
  | UpdateShift
  | UpdateBase;

export async function updateSchedule(
  state: Schedule,
  action: ScheduleAction
): Promise<Schedule> {
  // Create a deep copy so the generate schedule is allowed to mutate it
  const scheduleCopy = Schedule.createDeepCopy(state);
  if ("add" in action) {
    if (action.add instanceof Employee) {
      scheduleCopy.addEmployee(action.add);
    } else if (action.add instanceof Shift) {
      scheduleCopy.addShift(action.add);
    }
  } else if ("remove" in action) {
    if (action.remove instanceof Employee) {
      scheduleCopy.removeEmployee(action.remove);
    } else if (action.remove instanceof Shift) {
      scheduleCopy.removeShift(action.remove);
    }
  } else if ("update" in action) {
    if (action.update === "default") {
      if (action.maxHours !== undefined) {
        scheduleCopy.maxHoursWorked = action.maxHours;
      }
      if (action.minHours !== undefined) {
        scheduleCopy.minHoursWorked = action.minHours;
      }
    } else if (action.update instanceof Shift) {
      const a = action as UpdateShift;
      const e = scheduleCopy.removeShift(a.update);
      scheduleCopy.addShift(
        new Shift(or(a.name, e.name), or(a.start, e.start), or(a.end, e.end))
      );
    } else if (action.update instanceof Employee) {
      const a = action as UpdateEmployee;
      const e = scheduleCopy.removeEmployee(a.update);
      scheduleCopy.addEmployee(
        new Employee(
          or(a.name, e.name),
          or(a.minHours, e.min_hours),
          or(a.maxHours, e.max_hours),
          or(a.color, e.color),
          e.available
        )
      );
    }
  }

  // Generate the schedule
  const schedulePromise = await generate(
    scheduleCopy.shifts,
    scheduleCopy.employees
  );
  if (!schedulePromise) {
    // If the scheduler failed, error out
    console.error("Unable to build schedule completely");
  }
  log(scheduleCopy);
  return scheduleCopy;
}

export type Dispatch<A> = (action: A) => void;

/**
 * Async equavalent to React.useReducer
 * */
export function useAsyncReducer<T, A>(
  reducer: (state: T, action: A) => Promise<T>,
  initialState: T
): [T, Dispatch<A>] {
  const [state, setState] = useState(initialState);
  let current: Promise<T> = Promise.resolve(state);

  const dispatch = (action: A): void => {
    // We need to be able to handle multiple in-flight requests
    //
    // The idea is this will force multiple requests to wait in line. Ideally,
    // we would also be able to tell the reducer that there are more (i.e. don't
    // bother fully generating the schedule), but that doesn't seem like something
    // JS can do.
    current = current.then(async (state) => {
      const newState = await reducer(state, action);
      setState(newState);
      return newState;
    });
  };

  return [state, dispatch];
}