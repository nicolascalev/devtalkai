import {
  action,
  createStore,
  persist,
  createTypedHooks,
  computed,
} from "easy-peasy";
import { StoreModel } from "./StoreModel";

const store = createStore<StoreModel>(
  persist(
    {
      user: null,
      setUser: action((state, payload) => {
        state.user = payload;
      }),

      history: [],
      setHistory: action((state, payload) => {
        state.history = payload;
      }),

      voice: "",
      setVoice: action((state, payload) => {
        state.voice = payload;
      }),
      mark: "",
      setMark: action((state, payload) => {
        state.mark = payload;
      }),
      projectId: "",
      setProjectId: action((state, payload) => {
        state.projectId = payload;
      }),
    },
    {
      storage: "localStorage",
      // deny: ["startsAt", "finishesAt"],
    }
  )
);

export default store;

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
