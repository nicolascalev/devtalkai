import { Action, Computed } from "easy-peasy";
import { UserWithNestedProperties } from "../types/types";

export interface StoreModel {
  user: UserWithNestedProperties | null;
  setUser: Action<StoreModel, UserWithNestedProperties | null>;
}

export {};
