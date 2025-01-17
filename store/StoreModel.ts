import { Action, Computed } from "easy-peasy";
import { OutputListItemType, UserWithNestedProperties } from "../types/types";

export interface StoreModel {
  user: UserWithNestedProperties | null;
  setUser: Action<StoreModel, UserWithNestedProperties | null>;

  history: OutputListItemType[];
  setHistory: Action<StoreModel, OutputListItemType[]>;

  voice: string;
  setVoice: Action<StoreModel, string>;
  mark: string;
  setMark: Action<StoreModel, string>;
  projectId: string;
  setProjectId: Action<StoreModel, string>;
}

export {};
