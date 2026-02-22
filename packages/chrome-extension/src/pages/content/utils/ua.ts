import { UAParser } from "ua-parser-js";

const ua = new UAParser();

export type IsOSMacOS = () => boolean;
export const isOSMacOS: IsOSMacOS = () => {
  return ua.getOS().name === "macOS";
};
