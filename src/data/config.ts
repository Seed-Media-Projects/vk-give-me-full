import type { GroupConfig } from "../types/groups";

export const fetchConfigs = async () => {
  const res = await fetch("/config.json");
  const dataConfig = (await res.json()) as GroupConfig[];

  return dataConfig;
};
