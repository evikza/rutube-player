# RutubePlayer JS

Обертка над [Rutube Player JSON API](https://github.com/rutube/RutubePlayerJSAPI).

## Установка

```
npm i rutube-player
```

Но, можно просто подключить файл к HTML странице:

```html
<script src="https://unpkg.com/rutube-player@1.0.5"></script>
```

## Инициализация

На странице должен находиться контейнер с идентификатом:

```html
<div id="player"></div>
```

```js
const rt = new Rutube();

rt.Player('player', {
  width: 560,
  height: 315,
  videoId: '6e5e06ad0f3104ae47fb0f69d2198855',
});
```

#### Доступные методы

Передаваемые параметры соответствуют официальному [Rutube Player JSON API](https://github.com/rutube/RutubePlayerJSAPI)

| Название    |      Параметры      | Описание                             |
| ----------- | :-----------------: | ------------------------------------ |
| play        |          -          | Начать проигрывание видео            |
| pause       |          -          | Поставить видео на паузу             |
| stop        |          -          | Закончить цикл проигрывания          |
| seekTo      |   `{ time: 20 }`    | Переход к определенной секунде видео |
| changeVideo | `{ id: "videoId" }` | Загрузить в плеер другое видео       |
| unMute      |          -          | Включение звука                      |
| mute        |          -          | Выключение звука                     |

#### Методы для получения информации о текущем видео

| Название            | Параметры | Описание                      |
| ------------------- | :-------: | ----------------------------- |
| `currentDuration()` |     -     | Текущее время воспроизведения |

## Публичный API

Возможность подписаться на событие состояния плеера и вызвать пользовательскую функцию:

```json
{
  /* ... */
  "videoId": "6e5e06ad0f3104ae47fb0f69d2198855",
  "events": {
    "onReady": "onPlayerReady",
    "onStateChange": "onPlayerStateChange"
  }
}
```

```js
function onPlayerReady(event) {
  console.log('Плеер загружен.');
  console.log(event); // { videoId: '6e5e06ad0f3104ae47fb0f69d2198855', clientId: 'e56df991-ca59-4036-91b8-e2913944f84c' }

  setTimeout('rt.play()', 700);
}

function onPlayerStateChange(event) {
  console.log(event); //  { 'playerState': { 'PLAYING': 0, 'PAUSED': 1, 'STOPPED': 0, 'ENDED': 0 } }

  if (event.playerState.PAUSED) {
    console.log('PAUSED');

    console.log(rt.currentDuration()); // 41.635709
  }

  if (event.playerState.ENDED) {
    console.log('ENDED');

    // если текущее видео закончилось, переход к другому с ID d124f6d7c977b94031051409aa55648a
    rt.changeVideo({
      id: 'd124f6d7c977b94031051409aa55648a',
    });
  }

  // if (event.playerState.PLAYING && !jumpToSeek) {
  //   rt.seekTo({ time: 124 });
  //   jumpToSeek = true;
  // }
}
```
