const Rutube = function () {
  const EMBEDED_API_URI = '//rutube.ru/play/embed/';
  const PREFFIX_PLAYER_ID = 'rt-';

  this.Player = function (selector, config) {
    if (!selector) {
      throw new Error('The Player element must be specified.');
    }

    this.selector = selector;
    this.config = config;
    this.duration = null;
    this.videoCurrentDuration = 0;

    this.renderOnPage();
  };

  this.renderOnPage = function () {
    const options = {
      id: PREFFIX_PLAYER_ID + this.selector,
      width: this.config.width || 720,
      height: this.config.height || 405,
      src: EMBEDED_API_URI + this.config.videoId,
      frameBorder: 0,
      allow: 'autoplay',
      allowFullScreen: '',
      webkitallowfullscreen: '',
      mozallowfullscreen: '',
    };

    const element = document.createElement('iframe');

    for (let property in options) {
      element.setAttribute(property, options[property]);
    }

    document.getElementById(this.selector).appendChild(element);
  };

  this.triggerEventObserver = function (env, args = null) {
    if (!this.config.events || !this.config.events[env]) return;

    return this.config.events[env](args);
  };

  this.setPlayerState = function (status) {
    const playerState = {
      PLAYING: 0,
      PAUSED: 0,
      STOPPED: 0,
      ENDED: 0,
    };

    for (let state in playerState) {
      if (state.toLowerCase() === status.toLowerCase()) {
        playerState[state] = 1;

        break;
      }
    }

    return { playerState };
  };

  this.currentDuration = function () {
    return this.videoCurrentDuration;
  };

  for (let [iterator, type] of Object.entries({
    play: 'play',
    pause: 'pause',
    stop: 'stop',
    seekTo: 'setCurrentTime',
    changeVideo: 'changeVideo',
    mute: 'mute',
    unMute: 'unMute',
    setVolume: 'setVolume',
  })) {
    this[iterator] = function (data = {}) {
      document
        .getElementById(PREFFIX_PLAYER_ID + this.selector)
        .contentWindow.postMessage(
          JSON.stringify({
            type: 'player:' + type,
            data: data,
          }),
          '*'
        );
    };
  }

  this.playerEvent = function (receivedMessage) {
    switch (receivedMessage.type) {
      case 'player:durationChange':
        // ...

        break;
      case 'player:ready':
        this.triggerEventObserver('onReady', {
          videoId: receivedMessage.data.videoId,
          clientId: receivedMessage.data.clientId,
        });

        break;
      case 'player:changeState':
      case 'player:playComplete':
        this.triggerEventObserver(
          'onStateChange',
          this.setPlayerState(receivedMessage.data.state || 'ENDED')
        );

        break;
      case 'player:currentTime':
        this.videoCurrentDuration = receivedMessage.data.time;

        break;
    }
  };

  window.addEventListener(
    'message',
    function (event) {
      const receivedMessage = JSON.parse(event.data);

      this.playerEvent(receivedMessage);
    }.bind(this),
    0
  );
};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = Rutube;
  }
  exports.Rutube = Rutube;
}
