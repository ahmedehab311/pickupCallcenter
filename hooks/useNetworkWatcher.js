// useNetworkWatcher.js
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useOnlineStatus } from "./useOnlineStatus";

export const useNetworkWatcher = (onReconnect) => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      toast.success("Online now!");
    onReconnect()
      setWasOffline(false);
    }
  }, [isOnline, wasOffline]);

  return isOnline;
};
