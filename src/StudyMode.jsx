import React from "react";

function StudyMode({ showFront, currentCard, flipCard, prevCard, nextCard, finishStudy, markCurrentCardAsLearned }) {
  return (
    <section id="learn">
      <div id="learn-content">
        <h3>Карточка</h3>
        <div id="study-card" role="button" tabIndex="0" aria-label="Перевернуть карточку" onClick={flipCard}>
          <div id="card-inner" className={!showFront ? "is-flipped" : ""}>
            <div id="card-front-side" className="card-face">
              {currentCard !== null ? currentCard.front : "Нет карточек для изучения"}
            </div>
            <div id="card-back-side" className="card-face">
              {currentCard !== null ? currentCard.back : "Добавь карточки в текущую колоду"}
            </div>
          </div>
        </div>
        <div className="actions">
          <button id="prev-button" type="button" onClick={prevCard}>
            Назад
          </button>
          <button id="next-button" type="button" onClick={nextCard}>
            Далее
          </button>
          <button id="finish-button" type="button" onClick={finishStudy}>
            Завершить
          </button>
          <button id="learn-button2" type="button" onClick={markCurrentCardAsLearned}>
            Выучить
          </button>
        </div>
      </div>
    </section>
  );
}

export default StudyMode;
