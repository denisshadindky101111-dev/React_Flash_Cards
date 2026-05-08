export default class Deck {
  constructor(name) {
    this.id = Date.now();
    this.name = name;
    this.cards = [];
  }
}
