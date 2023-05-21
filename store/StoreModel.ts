import { Action, Computed } from "easy-peasy";
import { OutputListItemType, UserWithNestedProperties } from "../types/types";

export interface StoreModel {
  user: UserWithNestedProperties | null;
  setUser: Action<StoreModel, UserWithNestedProperties | null>;

  history: OutputListItemType[];
  setHistory: Action<StoreModel, OutputListItemType[]>;
}

export {};
