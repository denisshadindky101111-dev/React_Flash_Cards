export default class Card {
  constructor(front, back) {
    this.id = Date.now() + Math.random();
    this.front = front;
    this.back = back;
    this.learned = false;
  }
}