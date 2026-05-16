// scripts/core/state.js

// Persistent game state and save/load helpers.

const GAME_VERSION = '2.3';

const GameState = {
  currentApp: null,
  unlockedContent: {},
  foundClues: [],
  searchQueries: [],
  puzzleProgress: {},
  gamePhase: 1,
  readChats: {},
  endingTriggered: false,
  goodEndingTriggered: false,
  fineTuneUnlocked: false,
  memberLoggedIn: false,
  adminLoggedIn: false,
  finalMemberUnlock: false,
  _currentMember: null,
  _endingCompleted: false,
  _readDiaries: [],
  gameTimeElapsed: 0,
  _savedAccounts: [],

  save() {
    try {
      localStorage.setItem('gameSave', JSON.stringify({
        _version: GAME_VERSION,
        currentApp: this.currentApp,
        unlockedContent: this.unlockedContent,
        foundClues: this.foundClues,
        searchQueries: this.searchQueries,
        puzzleProgress: this.puzzleProgress,
        gamePhase: this.gamePhase,
        readChats: this.readChats,
        endingTriggered: this.endingTriggered,
        goodEndingTriggered: this.goodEndingTriggered,
        fineTuneUnlocked: this.fineTuneUnlocked,
        memberLoggedIn: this.memberLoggedIn,
        adminLoggedIn: this.adminLoggedIn,
        finalMemberUnlock: this.finalMemberUnlock,
        _currentMember: this._currentMember,
        _endingCompleted: this._endingCompleted,
        _readDiaries: this._readDiaries,
        gameTimeElapsed: this.gameTimeElapsed,
        _savedAccounts: this._savedAccounts,
      }));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  },

  load() {
    try {
      const saved = localStorage.getItem('gameSave');
      if (saved) {
        const data = JSON.parse(saved);
        if (data._version !== GAME_VERSION) {
          this.reset();
          return;
        }
        Object.assign(this, data);
        if (this._currentMember === 'R-879-15' && !this.finalMemberUnlock) {
          this.memberLoggedIn = false;
          this._currentMember = null;
        }
      }
    } catch (e) {
      console.warn('Load failed:', e);
    }
  },

  reset() {
    const hadEnding = this._endingCompleted;
    const hadReadDiaries = this._readDiaries;
    const hadPhase = this.gamePhase;
    localStorage.removeItem('gameSave');
    this.currentApp = null;
    this.unlockedContent = {};
    this.foundClues = [];
    this.searchQueries = [];
    this.puzzleProgress = {};
    this.gamePhase = hadPhase > 1 ? hadPhase : 1;
    this.readChats = {};
    this.endingTriggered = false;
    this.goodEndingTriggered = false;
    this.fineTuneUnlocked = false;
    this.memberLoggedIn = false;
    this.adminLoggedIn = false;
    this.finalMemberUnlock = false;
    this._currentMember = null;
    this._endingCompleted = hadEnding;
    this._readDiaries = hadReadDiaries;
    this.gameTimeElapsed = 0;
    this._savedAccounts = [];
    this.save();
  }
};

