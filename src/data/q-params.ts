import { isDev } from "../constants";

export const qVK = isDev ? import.meta.env.VITE_QVK : window.location.search;
