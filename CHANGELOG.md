# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).


## 0.2.0
* Состояние попапа сохраняется между открытиями и обновляется по мере обновления storage из бекграунда
* Запрос не прерывается между закрытиями попапа
* Ошибки запросов обрабатываются, добавлена возможность перезапустить экспорт
* Логика экспорта и генерации CSV-файла разделена. Теперь файл не начинается генерироваться сразу после экспорта, так же можно скачать CSV-файл несколько раз.

## 0.1
* Initial release.s