document.addEventListener("DOMContentLoaded", function () {
  // 為每個菜單標題添加點擊事件
  const menuTitles = document.querySelectorAll(".menu-title");
  menuTitles.forEach((title) => {
    title.addEventListener("click", function (event) {
      event.stopPropagation();

      menuTitles.forEach((t) => t.classList.remove("selected"));
      this.classList.add("selected");

      const submenu = this.nextElementSibling;
      if (submenu) {
        submenu.style.display =
          submenu.style.display === "block" ? "none" : "block";
      }
    });
  });

  // 為 "GPT系統" 添加點擊事件
  const gptButton = document.querySelector(".gpt-system");
  if (gptButton) {
    gptButton.addEventListener("click", function () {
      localStorage.setItem("selectedMenuItem", "GPT");
      window.location.href = "GPT.html"; // 導航到 GPT.html
    });
  }

  // 檢查是否選中 "GPT系統"
  if (localStorage.getItem("selectedMenuItem") === "GPT") {
    const gptButton = document.querySelector(".gpt-system");
    if (gptButton) {
      gptButton.classList.add("selected");
    }
  }

  const menuItems = document.querySelectorAll(".menu-item:not(.gpt-system)");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      localStorage.removeItem("selectedMenuItem");
      // 其他邏輯...
    });
  });

  // 為下拉選單項目添加點擊事件
  const submenuItems = document.querySelectorAll(".submenu-item");
  submenuItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.stopPropagation();

      submenuItems.forEach((i) => i.classList.remove("item-selected"));
      this.classList.add("item-selected");
    });
  });

  // 下拉式細項的自動收回功能
  menuTitles.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.stopPropagation();

      const currentSubmenus = this.parentNode.querySelectorAll(".submenu-item");

      currentSubmenus.forEach((submenu) => {
        submenu.style.display =
          submenu.style.display === "block" ? "none" : "block";
      });

      document.querySelectorAll(".submenu-item").forEach((sub) => {
        if (!Array.from(currentSubmenus).includes(sub)) {
          sub.style.display = "none";
        }
      });
    });
  });

  // 新增功能: 點擊除了選單以外的地方，下拉選單會自動收回
  document.addEventListener("click", function () {
    const allSubmenus = document.querySelectorAll(".submenu-item");
    allSubmenus.forEach((submenu) => {
      submenu.style.display = "none";
    });
    menuTitles.forEach((title) => title.classList.remove("selected"));
  });

  // "您好，最高管理員"點選展開列表
  const adminText = document.querySelector(".admin-text");
  const adminDropdown = document.querySelector(".admin-dropdown");

  adminText.addEventListener("click", function () {
    adminDropdown.style.display =
      adminDropdown.style.display === "none" || !adminDropdown.style.display
        ? "block"
        : "none";
  });

  // 點擊其他地方時隱藏下拉菜單
  document.addEventListener("click", function (event) {
    if (!adminText.contains(event.target)) {
      adminDropdown.style.display = "none";
    }
  });

  // 監聽每一個 selectedRowElement 的點擊事件
  const selectedRowElements = document.querySelectorAll(".row");
  selectedRowElements.forEach((selectedRowElement, index) => {
    selectedRowElement.addEventListener("click", function () {
      const cells = selectedRowElement.querySelectorAll("td");
      const data = Array.from(cells).map((cell) => cell.innerText);
      localStorage.setItem("selectedRowData", JSON.stringify(data));

      window.location.href = `database${index + 1}.html`;
    });
  });

  // 當文檔加載完畢時，設置事件監聽器
  const rows = document.querySelectorAll(".row");
  if (rows) {
    rows.forEach(function (row, index) {
      row.addEventListener("click", function () {
        const id = row.querySelector("td").innerText;
        const cells = Array.prototype.slice.call(row.querySelectorAll("td"));
        const data = cells.map(function (cell) {
          return cell.innerText;
        });

        localStorage.setItem("selectedRowData", JSON.stringify(data));

        const databasePage =
          id === "1" ? "database.html" : `database${id}.html`;
        window.location.href = databasePage;
        toggleClickedStyle(rows, row);
      });
    });
  }

  // 切換行的選中樣式
  function toggleClickedStyle(rows, selectedRow) {
    if (!selectedRow.classList.contains("clicked")) {
      rows.forEach((row) => {
        row.classList.remove("clicked");
      });
      selectedRow.classList.add("clicked");
    } else {
      selectedRow.classList.remove("clicked");
    }
  }

  // 頁數分頁切換 "1...2"
  var currentPage = 1; // 起始頁碼
  var maxRows = 5; // 每頁最大行數
  var totalRows = document.querySelectorAll(".row").length; // 總行數
  var totalPages = Math.ceil(totalRows / maxRows); // 總頁數
  var filteredRows = []; // 存儲符合條件的行
  var isFilterMode = false; // 新增一個變量跟蹤篩選模式

  function showRows(page) {
    var start = (page - 1) * maxRows;
    var end = start + maxRows;
    var rowsToShow = isFilterMode
      ? filteredRows.slice(start, end)
      : Array.from(document.querySelectorAll(".row")).slice(start, end); // 根據是否篩選來選擇行

    // 隱藏所有行
    document
      .querySelectorAll(".row")
      .forEach((row) => (row.style.display = "none"));

    // 只顯示需要顯示的行，並更新行的編號
    rowsToShow.forEach((row, index) => {
      row.style.display = "table-row"; // 使用原始的顯示樣式
      row.cells[0].textContent = start + index + 1; // 更新行編號，從計算的起始編號開始
    });
  }

  function setupSearchInput() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", filterRows);
    } else {
      console.error("元素 'searchInput' 不存在！");
    }
  }

  function setupPagination() {
    var pagination = document.getElementById("pagination");
    if (pagination) {
      var pageButtons = pagination.querySelectorAll("button:not(.tab)");
      var dots = pagination.querySelector(".tab");

      // 更新分頁按鈕的數字
      function updatePaginationButtons() {
        if (currentPage === 1 && totalRows <= maxRows) {
          // 当前页为第一页且行数少于等于maxRows时，只显示一个按钮"1"
          pageButtons[0].textContent = 1;
          pageButtons[0].style.display = "inline-block";
          // 隐藏第二个按钮和tab
          pageButtons[1].style.display = "none";
          dots.style.display = "none";
        } else {
          pageButtons[0].textContent = currentPage > 1 ? currentPage - 1 : 1; // 上一頁按鈕顯示當前頁的上一頁
          pageButtons[1].textContent =
            currentPage < totalPages ? currentPage + 1 : totalPages; // 下一頁按鈕顯示當前頁的下一頁，不超過總頁數
          // 显示第二个按钮和tab
          pageButtons[1].style.display = "inline-block";
          dots.style.display = "inline-block";
        }
      }

      // 分頁按鈕事件
      pageButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          var buttonPageNumber = parseInt(this.textContent);
          if (
            buttonPageNumber !== currentPage &&
            buttonPageNumber >= 1 &&
            buttonPageNumber <= totalPages
          ) {
            currentPage = buttonPageNumber;
            showRows(currentPage);
            updatePaginationButtons();
          }
        });
      });

      // 點擊點點（...）跳轉到下一組頁碼
      if (dots) {
        dots.addEventListener("click", function () {
          var nextPageSet = currentPage + 10 - (currentPage % 10);
          currentPage = nextPageSet <= totalPages ? nextPageSet : totalPages;
          showRows(currentPage);
          updatePaginationButtons();
        });
      }

      updatePaginationButtons(); // 初始化分頁按鈕的數字
    } else {
      console.error("元素 'pagination' 不存在！");
    }
  }

  // row欄位搜尋功能
  function filterRows() {
    var searchInput = document.getElementById("searchInput");
    var filter = searchInput.value.toLowerCase();
    var rows = Array.from(document.querySelectorAll(".row"));

    isFilterMode = filter.length > 0; // 如果有搜尋條件則開啟篩選模式
    filteredRows = []; // 清空篩選後的行數組

    // 有搜索條件時進行篩選
    if (isFilterMode) {
      rows.forEach(function (row) {
        var text = row.textContent.toLowerCase();
        if (text.includes(filter)) {
          filteredRows.push(row);
        }
      });
    }

    totalRows = isFilterMode ? filteredRows.length : rows.length; // 更新總行數
    totalPages = Math.ceil(totalRows / maxRows); // 更新總頁數
    currentPage = 1; // 搜索後重置為第一頁
    showRows(currentPage); // 顯示第一頁
    updatePaginationButtons(); // 更新分頁按鈕狀態
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterRows);
  } else {
    console.error("元素 'searchInput' 不存在！");
  }

  if (document.getElementById("searchInput")) {
    setupSearchInput();
  }

  showRows(currentPage); // 初始顯示行

  if (document.getElementById("pagination")) {
    setupPagination();
  }

  // --------------------------- Page 2--------------------------- //
  // back-page回上頁
  const backButton = document.querySelector(".back-page");
  if (backButton) {
    backButton.addEventListener("click", function () {
      window.history.back();
    });
  }

  // 獲取模態框和按鈕元素
  const modal = document.getElementById("myModal");
  const btn = document.querySelector(".condition-btn");
  const modalOverlay = document.getElementById("modalOverlay"); // 获取模态框的覆盖层
  const addMachineIcon = document.querySelector(".alarm-add-machine");

  if (btn) {
    // 當按鈕被點擊時，打開模態框
    btn.onclick = function () {
      modal.style.display = "block";
    };
  }

  // 绑定事件到 alarm-add-machine 类的元素
  if (addMachineIcon) {
    addMachineIcon.onclick = function () {
      modal.style.display = "block";
      modalOverlay.style.display = "block"; // 显示模态框的覆盖层
    };
  }

  // 关闭模态框的功能
  const closeModalBtn = document.getElementById("closeModalBtn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
      modalOverlay.style.display = "none"; // 隐藏模态框的覆盖层
    });
  }

  const imageInputs = document.querySelectorAll(".image-input");
  imageInputs.forEach(function (input) {
    input.addEventListener("change", function (e) {
      const image = input.parentElement.querySelector(".uploaded-image");
      const placeholder =
        input.parentElement.querySelector(".placeholder-text");

      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();

        reader.onload = function (event) {
          if (image) {
            image.src = event.target.result;
            image.style.display = "block";
          }
          if (placeholder) {
            placeholder.style.display = "none";
          }
        };

        reader.readAsDataURL(e.target.files[0]);
      }
    });
  });

  function removeImage() {
    const image = document.getElementById("uploaded-image");
    const placeholder = document.querySelector(".placeholder-text");
    image.src = "";
    image.style.display = "none";
    placeholder.style.display = "block";
  }
});

// 檔案印出
function downloadFile() {
  // 創建一個新的 a 標籤
  var element = document.createElement("a");
  // 設置文件的 URL，這裡需要放上您的 PDF 文件路徑
  element.setAttribute("href", "path/to/your/file.pdf");
  // 設置下載時的文件名
  element.setAttribute("download", "維修說明文件.pdf");
  // 隱藏此元素
  element.style.display = "none";
  // 將其添加到文檔中
  document.body.appendChild(element);
  // 模擬點擊
  element.click();
  // 移除元素
  document.body.removeChild(element);
}

/* // 清空列表項目 test
function clearListAndLocalStorage() {
// 清空 localStorage 中与列表相关的数据
localStorage.removeItem('newMachines')

// 获取列表容器
var menuContainer = document.querySelector('.menu')
if (menuContainer) {
  // 清空列表容器中的所有子元素
  while (menuContainer.firstChild) {
    menuContainer.removeChild(menuContainer.firstChild)
  }
}
}

// 直接调用函数来清空列表和 localStorage
clearListAndLocalStorage() */
