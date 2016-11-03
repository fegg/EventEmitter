events = {}

class EventEmitter {
  sub( eventName, fn ) {
    if( !events[eventName] ) {
      events[eventName] = []
    }

    events[eventName].push( fn )

    return () => {
      events[eventName] = events[eventName]
        .filter(eventFn => fn !== eventFn)
    }
  }

  emit( eventName, data ) {
    const event = events[eventName]
    if( event ) {
      event.forEach(fn => {
        fn.call(null, data)
      })
    }
  }
}

module.exports = EventEmitter;
