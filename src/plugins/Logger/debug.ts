const debug = typeof window === 'undefined' ? null : localStorage.getItem('DEBUG');
const flags = debug !== null ? debug.split(',') : [];
const flagSet = new Set<string>(flags);
const isAllMatch = flagSet.has('*');
export const isDebugEnabled = (key: string): boolean => {
  if (debug === null) {
    return false;
  }
  if (isAllMatch) {
    return true;
  }
  return flagSet.has(key);
};
export const logIfDebug = (key: string, computeLog: () => any) => {
  if (isDebugEnabled(key)) {
    console.debug('[DEBUG]', key, computeLog());
  }
};
