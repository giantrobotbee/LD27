var Game = Class.extend({
  init: function(mapData) {
    this._mapData = mapData
  },

  buildMap: function() {
    // Iterate over rooms
    var rooms = this._mapData["rooms"]
    for(var r in rooms) {
      var room = new Room(r)
      var doors = rooms[r]["doors"]
      var messages = rooms[r]["messages"] || []

      // Add doors if we have any
      if(doors.length > 0) {
        for(var d in doors) {
          var target = doors[d]
          var door = new Door(target)
          room.addDoor(door)
        }
      } else {
        room.makeDeadEnd()
      }

      // Add messages if we've got 'em
      if(messages.length > 0) {
        for(var m in messages) {
          var text = messages[m]
          var msg = new Message(text)

          room.addMessage(msg)
        }
      }

      this._map.addRoom(room)
    }
  },

  onRoomStart: function(e) {
    var self = e.data.self

    self._soundManager.stopSound(SoundManager.TICKING)
    self._soundManager.playSound(SoundManager.TICKING)
    //Probably also want to start the timer here
  },

  onRoomNavigate: function(e) {
    var self = e.data.self

    self._gameView.update()
  },

  onMsgStart: function(e) {
    var self = e.data.self

    self._soundManager.stopSound(SoundManager.TICKING)
  },

  onMsgNavigate: function(e) {
    var self = e.data.self

    self._gameView.update()
  },

  onMsgEnd: function(e) {
    var self = e.data.self

    self._gameView.update()
  },

  bindNavigationEvents: function() {
    $("li.door").on("click", {self: this._navigator}, this._navigator.doorNav)
    $("span.msg-nav").on("click", {self: this._navigator}, this._navigator.msgNav)
    $(document).on(NavigationEvent.ROOM_START, {self: this}, this.onRoomStart)
    $(document).on(NavigationEvent.ROOM_NAV, {self: this}, this.onRoomNavigate)
    $(document).on(NavigationEvent.MSG_START, {self: this}, this.onMsgStart)
    $(document).on(NavigationEvent.MSG_NAV, {self: this}, this.onMsgNavigate)
    $(document).on(NavigationEvent.MSG_END, {self: this}, this.onMsgEnd)
  },

  unbindNavigationEvents: function() {
    $("li.door").off("click")
    $("span.msg-nav").off("click")
    $(document).off(NavigationEvent.ROOM_NAV)
    $(document).off(NavigationEvent.MSG_NAV)
    $(document).off(NavigationEvent.MSG_END)
  },

  getRoomManager: function() {
    return this._roomManager
  },

  run: function() {
    this._map = new Map()
    this.buildMap()
    this._roomManager = new RoomManager(this._map)
    this._navigator = new Navigator(this._roomManager)
    this._soundManager = new SoundManager()
    this._gameView = new GameView(this)

    this._gameView.update()
  }
})
