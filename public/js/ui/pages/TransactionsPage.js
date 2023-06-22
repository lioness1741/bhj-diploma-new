/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
   constructor(element) {
    if (element) {
      this.element = element;
    } else {
      throw new Error("Элемент пуст!");
    }
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = document.querySelector(".remove-account");

    removeAccount.addEventListener("click", (event) => {
      event.preventDefault();
      this.removeAccount();
    });

    this.element.addEventListener("click", (event) => {
      event.preventDefault();
      let transactionRemove = event.target.closest(".transaction__remove");
      if (transactionRemove) {
        this.removeTransaction(transactionRemove.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return false;
    }
    let question = confirm("Вы действительно хотите удалить счёт?");
    if (question) {
      Account.remove({ id: this.lastOptions.account_id }, (error, response) => {
        console.log(response);

        if (response && response.success) {
          App.updateWidgets();
          App.updateForms();
          this.clear();
        } else {
          console.log("Ошибка удаления счета", response.error);
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let question = confirm("Вы действительно хотите удалить эту транзакцию?");
    if (question) {
      Transaction.remove({ id }, (error, response) => {
        if (response && response.success) {
          App.update();
        } else {
          console.log("Воозникла ошибка удаления транзакции", response.error);
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return false;
    }
    this.lastOptions = options;
    Account.get(options.account_id, (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data.name);
      } else {
        console.log("Ошибка при получении счета", response.error);
      }
    });

    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      } else {
        console.log("Ошибка при получении счета", response.error);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счета");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    let nameTitle = document.querySelector(".content-title");
    nameTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const currentDate = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    const currentTime = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    return `${currentDate} в ${currentTime}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const div = document.createElement("div");
    div.classList.add("transaction");
    div.classList.add("row");
    div.classList.add(`transaction_${item.type}`);
    div.innerHTML = `
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <!-- дата -->
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          <!--  сумма -->
          ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
          <i class="fa fa-trash"></i>  
        </button>
      </div>
    `;
    return div;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const transactionsList = document.querySelector(".content");
    transactionsList.innerHTML = "";
    for (let item of data) {
      let transaction = this.getTransactionHTML(item);
      let div = document.createElement("div");
      div.innerHTML = transaction;
      transactionsList.appendChild(div.firstChild);
    }
  }
}

