/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
   static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const sidebarMini = document.querySelector("body");

    sidebarToggle.addEventListener("click", event => {
      sidebarMini.className.add = "sidebar-open";
      sidebarMini.className.add = "sidebar-collapse";
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const register = document.querySelector(".menu-item_register");
    register.onclick = function() {
      App.getModal("register").open();
    };
    const login = document.querySelector(".menu-item_login");
    login.onclick = function() {
      App.getModal("login").open();
    };
    
    const logout = document.querySelector(".menu-item_logout");
      logout.onclick = function() {
      let callback = function(error, response) {
        if (response.success == true) {
          App.setState('init');
        }
      };
    User.logout(callback);
      };
  }
}