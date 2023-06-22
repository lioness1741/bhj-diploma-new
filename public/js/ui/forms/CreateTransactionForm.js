/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
   constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
      const callback = (error, response) => {

      const accountsSelect = this.element.querySelector('.accounts-select');

      accountsSelect.innerHTML = response.data.reduce((acc, item) => {
        const option = `<option value="${item.id}">${item.name}</option>`;
        acc = `${acc}${option}`;
        return acc;
      }, "");
    }    
   
    let user = User.current();
    if (user) {
      let data = {mail: user.email};
      Account.list(data, callback);
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    let callback = (error, response) => {
      if (response.success) {
        this.element.reset();
        App.getModal("newIncome").close();
        App.getModal("newExpense").close();
        App.update();
      }
    }
    Transaction.create(data, callback);
  }
}