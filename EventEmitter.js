; (function (exports) {
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  // 获取自己的直接属性
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  function isWrap (value) {
    return typeof value === 'object';
  }

  // 构造器
  function EventEmitter () { }
  // 原形引用缓存
  var proto = EventEmitter.prototype;

  // 查找 listeners
  function find (listeners, listener) {
    var n = listeners.length;
    if (n > 0) {
      for (var i = 0; i < n; ++i) {
        if (listeners[i].listener === listener) {
          return i;
        }
      }
    }

    return -1;
  }

  // 验证 listener 类型
  function valid (listener) {
    if (typeof listener === 'function') {
      return true;
    } else if (listener && typeof listener === 'object') {
      return valid(listener.listener);
    }

    return false;
  }

  /**
   * 获取监听器的引用
   * events: object 事件对象
   * key: string 事件类型
   * value: array 监听器数组
  */
  proto._getEvents = function () {
    return this._events || (this._events = {});
  };

  /**
   * 获取所有监听器
  */
  proto.getListeners = function (e) {
    var events = this._getEvents();

    return events[e] || (events[e] = []);
  };

  /**
   * 返回 object 类型的监听器数据
  */
  proto.getListenersAsObject = function (e) {
    var listeners = this.getListeners(e);
    var res = {};
    res[e] = listeners;

    return res;
  };

  /**
   * 注册事件，default: 永久存在
   * { listener: any(function), once: boolean }
  */
  proto.on = function (e, listener) {
    if (!valid(listener)) {
      throw new TypeError('listener must be a function');
    }

    var listeners = this.getListenersAsObject(e);
    var listenerIsWrapped = isWrap(listener);

    var key;
    for (key in listeners) {
      if (hasOwn(listeners, key) && find(listeners[key], listener) === -1) {
        listeners[key].push(listenerIsWrapped ? listener : {
          listener: listener,
          once: false
        });
      }
    }

    return this;
  };

  /**
   * 取消注册指定事件
  */
  proto.off = function (e, listener) {
    var listeners = this.getListenersAsObject(e);
    var index;
    var key;

    for (key in listeners) {
      if (hasOwn(listeners, key)) {
        index = find(listeners[key], listener);
        if (index !== -1) {
          listeners[key].splice(index, 1);
        }
      }
    }

    return this;
  };

  /**
   * 注册一次事件
  */
  proto.once = function (e, listener) {
    return this.on(e, {
      listener: listener,
      once: true
    });
  };

  /**
   * 销毁当前指定类型，所有注册的事件引用
  */
  proto.destory = function (e) {
    var type = typeof e;
    var events = this._getEvents();
    var key;

    if (type === 'string') {
      delete events[e];
    } else {
      delete this._events;
    }

    return this;
  };

  var sliceArray = Array.prototype.slice;
  /**
   * 触发定义的事件
  */
  proto.emit = function (e) {
    var listenersMap = this.getListenersAsObject(e);
    var listeners;
    var listener;
    var i;
    var key;
    var args = sliceArray.call(arguments, 1);

    for (key in listenersMap) {
      if (hasOwn(listenersMap, key)) {
        listeners = listenersMap[key].slice(0);

        var len = listeners.length;
        for (i = 0; i < len; ++i) {
          listener = listeners[i];

          if (listener.once === true) {
            this.off(e, listener.listener);
          }

          listener.listener.apply(this, args || []);
        }
      }
    }

    return this;
  }

  /**
   * 防止命名冲突
  */
  var _EventEmitter = exports.EventEmitter;
  EventEmitter.noConflict = function () {
    exports.EventEmitter = _EventEmitter;

    return EventEmitter;
  };

  /**
   * 模块导出：AMD、CommonJS、Global
  */
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return EventEmitter;
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = EventEmitter;
  } else {
    exports.EventEmitter = EventEmitter;
  }
})(this || {});
