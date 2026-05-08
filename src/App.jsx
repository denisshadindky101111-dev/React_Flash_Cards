import React from "react";
import "./App.css";
import Card from "./Card";
import Deck from "./Deck";
import StudyMode from "./StudyMode";

export default class App extends React.Component {
  state = {
    decks: [],
    selectedDeckNumber: null,
    studyMode: false,
    studyCards: [],
    studyIndex: 0,
    showFront: true,
    newDeckName: "",
    newCardFront: "",
    newCardBack: "",
  };

  componentDidMount() {
    const saved = localStorage.getItem("flashcards-app-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      this.setState({
        decks: parsed,
        selectedDeckNumber: parsed.length > 0 ? parsed[0].id : null,
      });
    }
  }

  saveToLS = () => {
    localStorage.setItem("flashcards-app-data", JSON.stringify(this.state.decks));
  };

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createDeck = () => {
    const name = this.state.newDeckName.trim();
    if (!name) return;

    const newDeck = new Deck(name);

    this.setState(
      (prev) => ({
        decks: [...prev.decks, newDeck],
        selectedDeckNumber: newDeck.id,
        newDeckName: "",
      }),
      this.saveToLS
    );
  };

  deleteDeck = () => {
    const id = this.state.selectedDeckNumber;
    if (!id) return;

    this.setState(
      (prev) => {
        const filtered = prev.decks.filter((d) => d.id !== id);
        return {
          decks: filtered,
          selectedDeckNumber: filtered.length > 0 ? filtered[0].id : null,
          studyMode: false,
        };
      },
      this.saveToLS
    );
  };

  createCard = () => {
    const { newCardFront, newCardBack, selectedDeckNumber } = this.state;
    if (!newCardFront.trim() || !newCardBack.trim()) return;

    const newCard = new Card(newCardFront, newCardBack);

    this.setState(
      (prev) => ({
        decks: prev.decks.map((d) =>
          d.id === selectedDeckNumber
            ? { ...d, cards: [...d.cards, newCard] }
            : d
        ),
        newCardFront: "",
        newCardBack: "",
      }),
      this.saveToLS
    );
  };

  deleteCard = (cardId) => () => {
    this.setState(
      (prev) => ({
        decks: prev.decks.map((d) =>
          d.id === prev.selectedDeckNumber
            ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
            : d
        ),
      }),
      this.saveToLS
    );
  };

  toggleLearned = (cardId) => () => {
    this.setState(
      (prev) => ({
        decks: prev.decks.map((d) =>
          d.id === prev.selectedDeckNumber
            ? {
                ...d,
                cards: d.cards.map((c) =>
                  c.id === cardId ? { ...c, learned: !c.learned } : c
                ),
              }
            : d
        ),
      }),
      this.saveToLS
    );
  };

  startStudy = () => {
    const current = this.state.decks.find((d) => d.id === this.state.selectedDeckNumber);
    if (!current || current.cards.length === 0) return;

    const shuffled = [...current.cards].sort(() => Math.random() - 0.5);

    this.setState({
      studyMode: true,
      studyCards: shuffled,
      studyIndex: 0,
      showFront: true,
    });
  };

  studyFlip = () => this.setState((p) => ({ showFront: !p.showFront }));
  
  studyNext = () => {
    this.setState((p) => ({
      studyIndex: (p.studyIndex + 1) % p.studyCards.length,
      showFront: true,
    }));
  };

  studyPrev = () => {
    this.setState((p) => ({
      studyIndex: (p.studyIndex - 1 + p.studyCards.length) % p.studyCards.length,
      showFront: true,
    }));
  };

  studyMark = () => {
    const card = this.state.studyCards[this.state.studyIndex];
    this.toggleLearned(card.id)();
  };

  render() {
    const currentDeck = this.state.decks.find((d) => d.id === this.state.selectedDeckNumber);

    return (
      <div className="App">
        <h1>Мои Карточки</h1>

        {this.state.studyMode ? (
          <StudyMode
            currentCard={this.state.studyCards[this.state.studyIndex]}
            showFront={this.state.showFront}
            flipCard={this.studyFlip}
            nextCard={this.studyNext}
            prevCard={this.studyPrev}
            finishStudy={() => this.setState({ studyMode: false })}
            markCurrentCardAsLearned={this.studyMark}
          />
        ) : (
          <div className="main-screen">
            <div className="panel">
              <strong>Новая колода: </strong>
              <input
                type="text"
                name="newDeckName"
                value={this.state.newDeckName}
                onChange={this.inputChange}
                placeholder="Название..."
              />
              <input type="button" value="Создать" onClick={this.createDeck} />
            </div>

            <div className="panel">
              <strong>Выбор колоды: </strong>
              <select
                value={this.state.selectedDeckNumber || ""}
                onChange={(e) => this.setState({ selectedDeckNumber: Number(e.target.value) })}
              >
                <option value="">-- не выбрано --</option>
                {this.state.decks.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <input type="button" value="Удалить колоду" onClick={this.deleteDeck} />
            </div>

            <hr />

            <div className="panel">
              <h3>Добавить карточку</h3>
              <input
                type="text"
                name="newCardFront"
                value={this.state.newCardFront}
                onChange={this.inputChange}
                placeholder="Вопрос (лицо)"
              />
              <input
                type="text"
                name="newCardBack"
                value={this.state.newCardBack}
                onChange={this.inputChange}
                placeholder="Ответ (оборот)"
              />
              <input type="button" value="Добавить" onClick={this.createCard} />
            </div>

            <hr />

            <div className="panel">
              <h3>Список карточек в колоде:</h3>
              {!currentDeck ? (
                <div className="empty-hint">Выберите колоду, чтобы увидеть карточки</div>
              ) : (
                <div>
                  <div>Всего: {currentDeck.cards.length}</div>
                  {currentDeck.cards.map((c) => (
                    <div key={c.id} className="card-row">
                      <input
                        type="checkbox"
                        checked={c.learned}
                        onChange={this.toggleLearned(c.id)}
                      />
                      <span> {c.front} — {c.back} </span>
                      <button type="button" onClick={this.deleteCard(c.id)}>Del</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="start-test-wrap">
              <input
                type="button"
                className="start-test"
                value="НАЧАТЬ ТЕСТ"
                onClick={this.startStudy}
                disabled={!currentDeck || currentDeck.cards.length === 0}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}