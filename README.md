# RutubePlayer JS

Обертка над [Rutube Player JSON API](https://github.com/rutube/RutubePlayerJSAPI).

## Установка

```
npm i rutube-player
```

Но, можно просто подключить файл к HTML странице:

```html
<script src="https://unpkg.com/rutube-player@1.0.3"></script>
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

#### Публичный API

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
function onPlayerReady() {
  console.log('Плеер загружен.');
}

function onPlayerStateChange(event) {
  if (event.playerState.PLAYING) {
    rt.seekTo({ time: 80 }); // Переход к определенной секунде видео
  }
}
```
