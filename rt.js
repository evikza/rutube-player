const Rutube = function () {
  const EMBEDED_API_URI = '//rutube.ru/play/embed/';
  const PREFFIX_PLAYER_ID = 'rt-';

  this.Player = function (selector, config) {
    if (!selector) {
      throw new Error('The Player element must be specified.');
    }

    this.selector = selector;
    this.config = config;

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
      playerState: { PLAYING: 0, PAUSED: 0, STOPPED: 0 },
    };

    for (let state in playerState.playerState) {
      if (state.toLowerCase() === status.toLowerCase()) {
        playerState.playerState[state] = 1;

        break;
      }
    }

    return playerState;
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
      case 'player:ready':
        this.triggerEventObserver('onReady');

        break;
      case 'player:changeState':
        this.triggerEventObserver(
          'onStateChange',
          this.setPlayerState(receivedMessage.data.state)
        );

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
