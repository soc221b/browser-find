import { create } from "zustand";
import { redux } from "zustand/middleware";
import { logger } from "../middleware/logger";
import reducer from "../reducer";
import initialState from "../state";

const useStore = create(logger(redux(reducer, initialState)));

export default useStore;
