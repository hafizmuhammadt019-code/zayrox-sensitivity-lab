/* ZAYROX SENSITIVITY LAB — Main Controller */
document.addEventListener("DOMContentLoaded", () => {

  const $ = Utils.qs;

  let currentDeviceProfile = null;
  let currentSensProfile = null;

  /* ---------- NAV TOGGLE ---------- */
  $('#navToggle').addEventListener('click', () => {
    $('#navLinks').classList.toggle('open');
  });
  Utils.qsa('.nav-links a').forEach(a => a.addEventListener('click', () => $('#navLinks').classList.remove('open')));

  /* ---------- DEVICE SUGGESTIONS (datalist) ---------- */
  const datalist = $('#deviceSuggestions');
  Object.keys(window.DEVICE_DATABASE || {}).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key.replace(/\b\w/g, c => c.toUpperCase());
    datalist.appendChild(opt);
  });

  /* ---------- DPI TOGGLE ---------- */
  $('#dpiModeToggle').addEventListener('change', (e) => {
    $('#customDpiGroup').classList.toggle('hidden-el', !e.target.checked);
    $('#dpiDisplay').textContent = e.target.checked ? $('#customDpiInput').value : "480";
  });
  $('#customDpiInput').addEventListener('input', (e) => {
    if ($('#dpiModeToggle').checked) $('#dpiDisplay').textContent = e.target.value;
  });

  /* ---------- ANALYZE DEVICE ---------- */
  $('#analyzeBtn').addEventListener('click', () => {
    const name = $('#deviceNameInput').value.trim();
    const ram = $('#ramSelect').value;
    const storage = $('#storageSelect').value;

    if (!name) {
      Utils.showToast("Please enter a device name.");
      return;
    }

    currentDeviceProfile = DeviceAnalyzer.analyze(name, ram, storage);
    renderDeviceAnalysis(currentDeviceProfile);
    renderDeviceSettings(currentDeviceProfile);
    renderDevOptions(currentDeviceProfile);
    document.getElementById('device-analyzer').scrollIntoView({ behavior: 'smooth' });
    Utils.showToast("Device analyzed successfully!");
  });

  function renderDeviceAnalysis(profile) {
    $('#perfScoreBar').style.width = profile.performanceScore + '%';
    $('#perfScoreText').textContent = profile.performanceScore;
    $('#perfTierBadge').textContent = profile.tier;
    $('#specChipset').textContent = profile.chipset;
    $('#specGpu').textContent = profile.gpu;
    $('#specAndroid').textContent = profile.android;
    $('#specScreen').textContent = profile.screen;
    $('#specRefresh').textContent = profile.refreshRate;
    $('#specRamStorage').textContent = `${profile.ram}GB / ${profile.storage}GB`;
    $('#deviceVerifiedNote').textContent = profile.verified
      ? "✅ Specifications matched from device database (approximate typical values)."
      : "⚠️ Some specifications could not be verified; optimization is based on available information (RAM/storage heuristics).";
  }

  /* ---------- GENERATE SENSITIVITY ---------- */
  $('#generateBtn').addEventListener('click', () => {
    if (!currentDeviceProfile) {
      Utils.showToast("Please analyze your device first!");
      document.getElementById('device-input').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const options = {
      playstyle: $('#playstyleSelect').value,
      range: $('#rangeSelect').value,
      weapon: $('#weaponSelect').value,
      dpiMode: $('#dpiModeToggle').checked ? 'experimental' : 'fixed',
      customDpi: $('#customDpiInput').value
    };

    currentSensProfile = SensitivityEngine.generate(currentDeviceProfile, options);
    renderSensitivityProfile(currentSensProfile);
    renderScores(currentSensProfile.scores);
    renderWeaponBehavior(currentSensProfile, options.weapon);
    ProfileManager.setCurrentProfile({ device: currentDeviceProfile, sensitivity: currentSensProfile, options });

    document.getElementById('profile-output').scrollIntoView({ behavior: 'smooth' });
    Utils.showToast("Sensitivity profile generated!");
  });

  function renderSensitivityProfile(p) {
    $('#valGeneral').textContent = p.general;
    $('#valRedDot').textContent = p.redDot;
    $('#valX2').textContent = p.x2;
    $('#valX4').textContent = p.x4;
    $('#valSniper').textContent = p.sniper;
    $('#valFreeLook').textContent = p.freeLook;
    $('#valFireButton').textContent = p.fireButton;
    $('#valDpi').textContent = p.dpi;
    $('#fireButtonExplanation').textContent = p.fireButtonReason;
  }

  function renderScores(scores) {
    $('#scoreOverallText').textContent = scores.overall + '/100';
    $('#scoreOverallBar').style.width = scores.overall + '%';

    const labels = {
      headshotControl: "Headshot Control",
      recoilControl: "Recoil Control",
      movement: "Movement",
      aimStability: "Aim Stability",
      closeRange: "Close Range",
      midRange: "Mid Range",
      longRange: "Long Range"
    };

    const list = $('#scoreList');
    list.innerHTML = '';
    Object.keys(labels).forEach(key => {
      const val = scores[key];
      const item = document.createElement('div');
      item.className = 'score-item';
      item.innerHTML = `
        <div class="score-item-top"><span>${labels[key]}</span><strong>${val}/100</strong></div>
        <div class="bar-track"><div class="bar-fill" style="width:${val}%"></div></div>
      `;
      list.appendChild(item);
    });
  }

  function renderWeaponBehavior(sensProfile, weapon) {
    const box = $('#weaponBehaviorText');
    if (!weapon) { box.textContent = "Select a weapon in the generator to see behavior notes."; return; }
    box.innerHTML = `
      <strong>${weapon}:</strong> ${sensProfile.weaponNote}<br><br>
      With your current profile (General ${sensProfile.general}, Red Dot ${sensProfile.redDot}), this weapon should feel more controllable during
      moving-target tracking, recoil compensation, and close/long-range transitions. If you still feel recoil pulling your shots off the head,
      check the Diagnostics section below.
    `;
  }

  /* ---------- COPY BUTTONS ---------- */
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
      const targetId = e.target.getAttribute('data-copy');
      const suffix = e.target.getAttribute('data-suffix') || '';
      const el = document.getElementById(targetId);
      if (el) {
        Utils.copyText(el.textContent + suffix).then(() => Utils.showToast("Copied!"));
      }
    }
  });

  $('#copyAllBtn').addEventListener('click', () => {
    if (!currentSensProfile || !currentDeviceProfile) {
      Utils.showToast("Generate a profile first!");
      return;
    }
    const text = `FREE FIRE GAMING LAB

Device: ${currentDeviceProfile.model}
RAM: ${currentDeviceProfile.ram}GB
Storage: ${currentDeviceProfile.storage}GB

DPI: ${currentSensProfile.dpi}

General: ${currentSensProfile.general}
Red Dot: ${currentSensProfile.redDot}
2X Scope: ${currentSensProfile.x2}
4X Scope: ${currentSensProfile.x4}
Sniper Scope: ${currentSensProfile.sniper}
Free Look: ${currentSensProfile.freeLook}

Fire Button: ${currentSensProfile.fireButton}%

Playstyle: ${currentSensProfile.playstyle}
Overall Optimization Score: ${currentSensProfile.scores.overall}/100

Generated by ZAYROX SENSITIVITY LAB`;
    Utils.copyText(text).then(() => Utils.showToast("All settings copied!"));
  });

  /* ---------- DIAGNOSTICS ---------- */
  $('#runDiagnosticsBtn').addEventListener('click', () => {
    const checked = Utils.qsa('#diagnosticsForm input:checked').map(cb => cb.value);
    if (checked.length === 0) {
      Utils.showToast("Select at least one issue.");
      return;
    }
    const results = Diagnostics.runDiagnostics(checked);
    const container = $('#diagnosticsResults');
    container.innerHTML = '';
    results.forEach(r => {
      const div = document.createElement('div');
      div.className = 'diag-item';
      div.innerHTML = `
        <h4>⚠️ ${r.title}</h4>
        <p><strong>Cause:</strong> ${r.cause}</p>
        <p class="fix"><strong>Fix:</strong> ${r.adjustment}</p>
      `;
      container.appendChild(div);
    });
  });

  /* ---------- TRAINING MODE ---------- */
  function refreshTrainingDisplay() {
    if (!currentSensProfile) {
      $('#trainingCurrentGeneral').textContent = '-';
      $('#trainingAdjustment').textContent = '-';
      $('#trainingTestValue').textContent = '-';
      $('#trainingTip').textContent = "Generate a sensitivity profile first to use Training Mode.";
      return;
    }
    const problemKey = $('#trainingProblemSelect').value;
    const adj = Diagnostics.getTrainingAdjustment(problemKey);
    const currentVal = currentSensProfile[adj.field];
    const testVal = Utils.clamp(currentVal + adj.adjustment, 1, 200);

    $('#trainingCurrentGeneral').textContent = `${adj.label}: ${currentVal}`;
    $('#trainingAdjustment').textContent = (adj.adjustment > 0 ? '+' : '') + adj.adjustment;
    $('#trainingTestValue').textContent = testVal;
    $('#trainingTip').textContent = adj.tip;

    $('#applyTrainingBtn').dataset.field = adj.field;
    $('#applyTrainingBtn').dataset.testval = testVal;
  }
  $('#trainingProblemSelect').addEventListener('change', refreshTrainingDisplay);

  $('#applyTrainingBtn').addEventListener('click', () => {
    if (!currentSensProfile) { Utils.showToast("Generate a profile first!"); return; }
    const field = $('#applyTrainingBtn').dataset.field;
    const testVal = Number($('#applyTrainingBtn').dataset.testval);
    currentSensProfile[field] = testVal;
    renderSensitivityProfile(currentSensProfile);
    refreshTrainingDisplay();
    Utils.showToast("Test value applied to profile!");
  });

  $('#resetTrainingBtn').addEventListener('click', () => {
    if (!currentDeviceProfile) return;
    const options = {
      playstyle: $('#playstyleSelect').value,
      range: $('#rangeSelect').value,
      weapon: $('#weaponSelect').value,
      dpiMode: $('#dpiModeToggle').checked ? 'experimental' : 'fixed',
      customDpi: $('#customDpiInput').value
    };
    currentSensProfile = SensitivityEngine.generate(currentDeviceProfile, options);
    renderSensitivityProfile(currentSensProfile);
    renderScores(currentSensProfile.scores);
    refreshTrainingDisplay();
    Utils.showToast("Profile reset to generated defaults.");
  });

  $('#saveTrainingBtn').addEventListener('click', () => {
    if (!currentSensProfile) { Utils.showToast("Nothing to save yet."); return; }
    const name = prompt("Name this profile:", `${currentDeviceProfile.model} - ${currentSensProfile.playstyle}`);
    if (name === null) return;
    ProfileManager.saveProfile({ device: currentDeviceProfile, sensitivity: currentSensProfile }, name);
    renderSavedProfiles();
    Utils.showToast("Profile saved!");
  });

  /* ---------- DEVICE SETTINGS / DEV OPTIONS ---------- */
  function renderDeviceSettings(profile) {
    const items = [
      { text: "Enable Game Mode / Do Not Disturb while playing", tag: "SAFE" },
      { text: `Use ${profile.refreshRate} refresh rate if your device and Free Fire graphics settings support it`, tag: "DEVICE DEPENDENT" },
      { text: "Close unused background apps before matches to free up RAM", tag: "SAFE" },
      { text: "Reduce animation/transition effects in system settings for snappier touch response", tag: "OPTIONAL" },
      { text: profile.tier === "ENTRY" ? "Lower in-game graphics quality to Smooth/Low for stable frame rate" : "Balanced/HD graphics should run smoothly on your tier", tag: "SAFE" },
      { text: "Keep device cool — avoid direct sunlight/charging during long sessions to prevent thermal throttling", tag: "OPTIONAL" }
    ];
    renderTagList('#deviceSettingsList', items);
  }

  function renderDevOptions(profile) {
    const items = [
      { text: "Reduce 'Animator duration scale' / 'Transition animation scale' (Settings → Developer Options)", tag: "DEVICE DEPENDENT" },
      { text: "Disable 'Window animation scale' for faster app/menu transitions", tag: "DEVICE DEPENDENT" },
      { text: "Enable 'Force GPU rendering' only if your device explicitly supports it and you understand the effect", tag: "OPTIONAL" },
      { text: "Do not enable USB debugging or unknown developer flags unless you know their purpose", tag: "OPTIONAL" }
    ];
    renderTagList('#devOptionsList', items);
  }

  function renderTagList(selector, items) {
    const list = $(selector);
    list.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      const tagClass = item.tag === 'SAFE' ? 'tag-safe' : (item.tag === 'OPTIONAL' ? 'tag-optional' : 'tag-device');
      li.innerHTML = `<span>${item.text}</span><span class="tag ${tagClass}">${item.tag}</span>`;
      list.appendChild(li);
    });
  }

  // Render generic device settings on load even before analysis (fallback tier BALANCED)
  renderDeviceSettings({ refreshRate: "90Hz", tier: "BALANCED" });
  renderDevOptions({});

  /* ---------- GAME VERSION ---------- */
  function renderGameVersion() {
    const v = window.GAME_VERSION_DATA;
    $('#gameVersionCurrent').textContent = v.currentVersion;
    $('#gameVersionDate').textContent = Utils.formatDate(v.lastUpdated);
    $('#gameVersionRevision').textContent = v.profileRevision;
    $('#gameVersionNotes').textContent = v.versionNotes;
  }
  renderGameVersion();

  /* ---------- LAB AI ---------- */
  const chatWindow = $('#aiChatWindow');

  function addChatMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `ai-msg ${sender === 'user' ? 'ai-user' : 'ai-bot'}`;
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  async function sendAIQuestion(question) {
    if (!question.trim()) return;
    addChatMessage(question, 'user');
    $('#aiInput').value = '';
    const context = { device: currentDeviceProfile, sensitivity: currentSensProfile };
    const answer = await LabAI.ask(question, context);
    addChatMessage(answer, 'bot');
  }

  $('#aiSendBtn').addEventListener('click', () => sendAIQuestion($('#aiInput').value));
  $('#aiInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendAIQuestion($('#aiInput').value); });
  Utils.qsa('.chip').forEach(chip => chip.addEventListener('click', () => sendAIQuestion(chip.textContent)));

  /* ---------- SAVED PROFILES ---------- */
  function renderSavedProfiles() {
    const list = $('#savedProfilesList');
    const profiles = ProfileManager.getSavedProfiles();
    list.innerHTML = '';
    if (profiles.length === 0) {
      list.innerHTML = '<li><span class="saved-meta">No saved profiles yet.</span></li>';
      return;
    }
    profiles.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <div class="saved-name">${p.name}</div>
          <div class="saved-meta">${new Date(p.timestamp).toLocaleString()}</div>
        </div>
        <div class="saved-actions">
          <button data-action="load" data-id="${p.id}">Load</button>
          <button data-action="delete" data-id="${p.id}">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  }
  renderSavedProfiles();

  $('#savedProfilesList').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const profiles = ProfileManager.getSavedProfiles();
    const found = profiles.find(p => p.id === id);
    if (!found) return;

    if (btn.dataset.action === 'load') {
      currentDeviceProfile = found.data.device;
      currentSensProfile = found.data.sensitivity;
      renderDeviceAnalysis(currentDeviceProfile);
      renderSensitivityProfile(currentSensProfile);
      renderScores(currentSensProfile.scores);
      Utils.showToast(`Loaded "${found.name}"`);
      document.getElementById('profile-output').scrollIntoView({ behavior: 'smooth' });
    } else if (btn.dataset.action === 'delete') {
      ProfileManager.deleteProfile(id);
      renderSavedProfiles();
      Utils.showToast("Profile deleted.");
    }
  });

  $('#saveProfileBtn').addEventListener('click', () => {
    if (!currentSensProfile) { Utils.showToast("Generate a profile first!"); return; }
    const name = prompt("Name this profile:", `${currentDeviceProfile.model} Profile`);
    if (name === null) return;
    ProfileManager.saveProfile({ device: currentDeviceProfile, sensitivity: currentSensProfile }, name);
    renderSavedProfiles();
    Utils.showToast("Profile saved!");
  });

  $('#exportProfileBtn').addEventListener('click', () => {
    if (!currentSensProfile) { Utils.showToast("Generate a profile first!"); return; }
    ProfileManager.exportAsJSON({ device: currentDeviceProfile, sensitivity: currentSensProfile });
    Utils.showToast("Profile exported as JSON.");
  });

  $('#importProfileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await ProfileManager.importFromFile(file);
      if (data.device && data.sensitivity) {
        currentDeviceProfile = data.device;
        currentSensProfile = data.sensitivity;
        renderDeviceAnalysis(currentDeviceProfile);
        renderSensitivityProfile(currentSensProfile);
        renderScores(currentSensProfile.scores);
        Utils.showToast("Profile imported successfully!");
      } else {
        Utils.showToast("Invalid profile file format.");
      }
    } catch (err) {
      Utils.showToast(err.message);
    }
    e.target.value = '';
  });

  $('#resetAllBtn').addEventListener('click', () => {
    if (!confirm("This will delete all saved profiles. Continue?")) return;
    ProfileManager.resetAll();
    renderSavedProfiles();
    Utils.showToast("All data reset.");
  });

  /* ---------- RESTORE LAST SESSION ---------- */
  const last = ProfileManager.getCurrentProfile();
  if (last && last.device && last.sensitivity) {
    currentDeviceProfile = last.device;
    currentSensProfile = last.sensitivity;
    renderDeviceAnalysis(currentDeviceProfile);
    renderDeviceSettings(currentDeviceProfile);
    renderDevOptions(currentDeviceProfile);
    renderSensitivityProfile(currentSensProfile);
    renderScores(currentSensProfile.scores);
    renderWeaponBehavior(currentSensProfile, currentSensProfile.weapon);
  }

  refreshTrainingDisplay();
});