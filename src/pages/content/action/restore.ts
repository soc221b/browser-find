import { State } from "../state";

/**
 * Restores the state kept from the previous page in the same tab.
 */
export type Restore = {
  type: "Restore";
  value: Pick<
    State,
    | "text"
    | "shouldMatchCase"
    | "shouldMatchWholeWord"
    | "shouldUseRegularExpression"
    | "history"
    | "historyIndex"
    | "lastCommittedText"
  >;
};
