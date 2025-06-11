import { isDev } from "../constants";
import type { GroupConfig } from "../types/groups";

export const fetchConfigs = async () => {
  const res = await fetch(
    isDev ? "/config.json" : "/config.json"
  );
  const dataConfig = (await res.json()) as GroupConfig[];

  return dataConfig;
};
