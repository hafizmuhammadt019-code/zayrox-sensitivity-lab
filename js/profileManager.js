/* ZAYROX LAB — Profile Manager (localStorage) */
window.ProfileManager = (function () {

  const KEYS = {
    saved: "zayrox_saved_profiles",
    current: "zayrox_current_profile"
  };

  function getSavedProfiles() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.saved)) || [];
    } catch (e) { return []; }
  }

  function saveProfile(profileData, name) {
    const profiles = getSavedProfiles();
    const entry = {
      id: Date.now().toString(36),
      name: name || `Profile ${profiles.length + 1}`,
      timestamp: new Date().toISOString(),
      data: profileData
    };
    profiles.unshift(entry);
    localStorage.setItem(KEYS.saved, JSON.stringify(profiles));
    return entry;
  }

  function deleteProfile(id) {
    const profiles = getSavedProfiles().filter(p => p.id !== id);
    localStorage.setItem(KEYS.saved, JSON.stringify(profiles));
  }

  function setCurrentProfile(profileData) {
    localStorage.setItem(KEYS.current, JSON.stringify(profileData));
  }

  function getCurrentProfile() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.current)) || null;
    } catch (e) { return null; }
  }

  function resetAll() {
    localStorage.removeItem(KEYS.saved);
    localStorage.removeItem(KEYS.current);
  }

  function exportAsJSON(profileData) {
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zayrox-profile.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result));
        } catch (e) {
          reject(new Error("Invalid JSON file."));
        }
      };
      reader.onerror = () => reject(new Error("Could not read file."));
      reader.readAsText(file);
    });
  }

  return { getSavedProfiles, saveProfile, deleteProfile, setCurrentProfile, getCurrentProfile, resetAll, exportAsJSON, importFromFile };
})();
