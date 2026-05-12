// js/state.js — game state management with localStorage persistence

const GAME_VERSION = '2.2';

const GameState = {
  currentApp: null,
  unlockedContent: {},
  foundClues: [],
  searchQueries: [],
  puzzleProgress: {},
  gamePhase: 1,
  endingTriggered: false,
  fineTuneUnlocked: false,
  finalMemberUnlock: false,
  memberLoggedIn: false,
  memberAccount: null,
  adminLoggedIn: false,

  save() {
    try {
      sessionStorage.setItem('gameSave', JSON.stringify({
        _version: GAME_VERSION,
        currentApp: this.currentApp,
        unlockedContent: this.unlockedContent,
        foundClues: this.foundClues,
        searchQueries: this.searchQueries,
        puzzleProgress: this.puzzleProgress,
        gamePhase: this.gamePhase,
        endingTriggered: this.endingTriggered,
        fineTuneUnlocked: this.fineTuneUnlocked,
        finalMemberUnlock: this.finalMemberUnlock,
        memberLoggedIn: this.memberLoggedIn,
        memberAccount: this.memberAccount,
        adminLoggedIn: this.adminLoggedIn,
      }));
      localStorage.removeItem('gameSave');
    } catch (e) {
      console.warn('Save failed:', e);
    }
  },

  load() {
    try {
      const saved = sessionStorage.getItem('gameSave');
      localStorage.removeItem('gameSave');
      if (saved) {
        const data = JSON.parse(saved);
        if (data._version !== GAME_VERSION) {
          this.reset();
          return;
        }
        Object.assign(this, data);
        if (this.memberAccount === 'R-879-15' && !this.finalMemberUnlock) {
          this.memberLoggedIn = false;
          this.memberAccount = null;
        }
      }
    } catch (e) {
      console.warn('Load failed:', e);
    }
  },

  reset() {
    sessionStorage.removeItem('gameSave');
    localStorage.removeItem('gameSave');
    this.currentApp = null;
    this.unlockedContent = {};
    this.foundClues = [];
    this.searchQueries = [];
    this.puzzleProgress = {};
    this.gamePhase = 1;
    this.endingTriggered = false;
    this.fineTuneUnlocked = false;
    this.finalMemberUnlock = false;
    this.memberLoggedIn = false;
    this.memberAccount = null;
    this.adminLoggedIn = false;
    this.save();
  }
};
