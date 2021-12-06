import axios from "axios";
import { useEffect } from "react";

export const usePreviewModeExit = () => {
  useEffect(() => {
    axios.post("/api/exit-preview")
  }, [])
}
