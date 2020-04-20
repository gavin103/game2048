window.fakeStorage = {
    _data: {},
    setItem: function(id, val) {
        return this._data[id] = String(val);
    },
    getItem: function(id) {
        return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },
    removeItem: function(id) {
        return delete this._data[id];
    },
    clear: function() {
        return this._data = {};
    }
};

function LocalStorageManager() {
    this.bestScoreKey = "bestScore";
    this.gameStateKey = "gameState";
    this.stateStore = "stateStore"
    var supported = this.localStorageSupported();
    this.storage = supported ? window.localStorage : window.fakeStorage;
    this.initStateStore()
}
LocalStorageManager.prototype.localStorageSupported = function() {
    var testKey = "test";
    var storage = window.localStorage;
    try {
        storage.setItem(testKey, "1");
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};
LocalStorageManager.prototype.initStateStore = function() {
    var hasStore = this.storage.getItem(this.stateStore)
    if(!hasStore){
        var store = new Array(20)
        this.storage.setItem(this.stateStore,JSON.stringify(store))
    }
};
LocalStorageManager.prototype.getBestScore = function() {
    return this.storage.getItem(this.bestScoreKey) || 0;
};
LocalStorageManager.prototype.setBestScore = function(score) {
    this.storage.setItem(this.bestScoreKey, score);
};
LocalStorageManager.prototype.getGameState = function() {
    var stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null;
};
LocalStorageManager.prototype.setGameState = function(gameState) {
    // var stateJSON = this.storage.getItem(this.gameStateKey);
    // this.saveState2Store(stateJSON)
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
    this.saveState2Store(JSON.stringify(gameState))
};
LocalStorageManager.prototype.clearGameState = function() {
    this.storage.removeItem(this.gameStateKey);
};
LocalStorageManager.prototype.fallbackGameState = function() {
    var store = JSON.parse(this.storage.getItem(this.stateStore))
    var stateJSON = store[18]
    if(stateJSON){
        this.storage.setItem(this.gameStateKey, stateJSON);
        store.unshift(null);
        store.unshift(null);
        store.length = 20;
        this.storage.setItem(this.stateStore,JSON.stringify(store))
    }else{
        alert('已无路可退咯')
    }
};
LocalStorageManager.prototype.saveState2Store = function(stateJSON) {
    var store = JSON.parse(this.storage.getItem(this.stateStore))
    store.push(stateJSON)
    store.shift()
    this.storage.setItem(this.stateStore,JSON.stringify(store))
}