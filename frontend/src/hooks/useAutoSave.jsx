// hooks/useAutoSave.js
import { useState, useCallback } from "react";

const useAutoSave = (blogData) => {
  const [saveStatus, setSaveStatus] = useState("Saved");

  const handleAutoSave = useCallback(
    (updatedFields) => {
      const updatedBlogData = { ...blogData, ...updatedFields };

      setSaveStatus("Saving...");

      // Simulate auto-save delay and update blogData
      const debounceTimeout = setTimeout(() => {
        // Simulate API call here, e.g. save to drafts
        console.log("Auto-saving...", updatedBlogData);
        setSaveStatus("Saved");
      }, 1000);

      return () => clearTimeout(debounceTimeout);
    },
    [blogData]
  );

  return { saveStatus, handleAutoSave };
};

export default useAutoSave;
