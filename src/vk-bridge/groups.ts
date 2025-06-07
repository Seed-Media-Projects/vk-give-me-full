import type { GroupConfig } from "../types/groups";
import { vkBridge } from "./instance";

export const joinGroup = async (groupId: number) => {
  try {
    await vkBridge.send("VKWebAppJoinGroup", { group_id: groupId });
  } catch (error) {
    console.debug("Error joining group:", error);
    await joinGroup(groupId);
  }
};
export const allowMessagesFromGroup = async (groupId: number) => {
  try {
    await vkBridge.send("VKWebAppAllowMessagesFromGroup", {
      group_id: groupId,
    });
  } catch (error) {
    console.debug("Error allowing messages from group:", error);
    await allowMessagesFromGroup(groupId);
  }
};

export const processGroups = async (groupsConfigs: GroupConfig[]) => {
  for (const groupConfig of groupsConfigs) {
    switch (groupConfig.type) {
      case "messages":
        await allowMessagesFromGroup(groupConfig.id);
        break;
      case "subscribe":
        await joinGroup(groupConfig.id);
        break;

      default:
        break;
    }
  }
};
