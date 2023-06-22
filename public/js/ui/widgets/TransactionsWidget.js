/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
   constructor( element ) {
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const modalIncome = document.querySelector(".create-income-button");
    const modalExpense = document.querySelector(".create-expense-button");
      modalIncome.addEventListener("click", (event) => {
      event.preventDefault();      
      App.getModal("newIncome").open();
    });
      modalExpense.addEventListener("click", (event) => {
      event.preventDefault();      
      App.getModal("newExpense").open();
    });
  }
}