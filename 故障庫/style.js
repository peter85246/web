// 為每個菜單標題添加點擊事件
const menuTitles = document.querySelectorAll(".menu-title");
menuTitles.forEach((title) => {
  title.addEventListener("click", function (event) {
    // 阻止事件傳播，避免點擊標題時觸發document的點擊事件
    event.stopPropagation();

    // 將其他選中的標題重設顏色
    menuTitles.forEach((t) => t.classList.remove("selected"));
    // 將此標題設為選中的顏色
    this.classList.add("selected");

    const submenu = this.nextElementSibling;
    if (submenu) {
      submenu.style.display =
        submenu.style.display === "block" ? "none" : "block";
    }
  });
});

// 為下拉選單項目添加點擊事件
const submenuItems = document.querySelectorAll(".submenu-item");
submenuItems.forEach((item) => {
  item.addEventListener("click", function (event) {
    // 阻止事件傳播，避免點擊子菜單項目時觸發document的點擊事件
    event.stopPropagation();

    // 將其他選中的項目重設顏色
    submenuItems.forEach((i) => i.classList.remove("item-selected"));
    // 將此項目設為選中的顏色
    this.classList.add("item-selected");
  });
});

// 下拉式細項的自動收回功能
document.addEventListener("DOMContentLoaded", function () {
  // 主要項目的類名為 'menu-title'，細項的類名為 'submenu-item'
  const menuItems = document.querySelectorAll(".menu-title");

  menuItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      // 阻止事件傳播，避免點擊主項目時觸發document的點擊事件
      event.stopPropagation();

      // 獲取該主項目下的所有細項
      const currentSubmenus = this.parentNode.querySelectorAll(".submenu-item");

      currentSubmenus.forEach((submenu) => {
        if (submenu.style.display === "block") {
          submenu.style.display = "none";
        } else {
          submenu.style.display = "block";
        }
      });

      // 收起其他主項目的細項
      document.querySelectorAll(".submenu-item").forEach((sub) => {
        if (!Array.from(currentSubmenus).includes(sub)) {
          sub.style.display = "none";
        }
      });
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
document.addEventListener("DOMContentLoaded", function () {
  const adminText = document.querySelector(".admin-text");
  const adminDropdown = document.querySelector(".admin-dropdown");

  adminText.addEventListener("click", function () {
    if (
      adminDropdown.style.display === "none" ||
      !adminDropdown.style.display
    ) {
      adminDropdown.style.display = "block";
    } else {
      adminDropdown.style.display = "none";
    }
  });

  // 點擊其他地方時隱藏下拉菜單
  document.addEventListener("click", function (event) {
    if (!adminText.contains(event.target)) {
      adminDropdown.style.display = "none";
    }
  });
});

// ------------------------------------------------------------------------

// 監聽每一個 selectedRowElement 的點擊事件
// (用以儲存 row 欄位的資料提供給資料庫頁面做對應顯示)
const selectedRowElements = document.querySelectorAll(".row");
selectedRowElements.forEach((selectedRowElement, index) => {
  // 为每个行元素添加点击事件
  selectedRowElement.addEventListener("click", function () {
    // 將選中的 selectedRowElement 的數據存儲到 localStorage
    const cells = selectedRowElement.querySelectorAll("td");
    const data = [];
    cells.forEach((cell) => data.push(cell.innerText));
    localStorage.setItem("selectedRowData", JSON.stringify(data));

    // 根據行的編號決定跳轉到哪個頁面
    // 索引為0的行跳轉到 database.html，索引為1的行跳轉到 database2.html，以此類推
    window.location.href = `database${index + 1}.html`; // 根据行号修改 URL
  });
});

// 當文檔加載完畢時，設置事件監聽器
document.addEventListener("DOMContentLoaded", function () {
  // 獲取所有.row類別的tr元素，即所有行
  let rows = document.querySelectorAll(".row");

  // 為每一行設置點擊事件監聽
  rows.forEach((row) => {
    row.addEventListener("click", function () {
      // 獲取當前行的第一個單元格的內容，即編號
      const id = row.querySelector("td").innerText;
      // 將點擊的行的數據存儲到localStorage中
      const cells = row.querySelectorAll("td");
      const data = [];
      cells.forEach((cell) => data.push(cell.innerText));
      localStorage.setItem("selectedRowData", JSON.stringify(data));

      // 根據編號導向對應的資料庫頁面
      // 對於編號1的特殊處理，導向到database.html
      let databasePage = id === "1" ? "database.html" : `database${id}.html`;
      window.location.href = databasePage; // 跳轉到對應的資料庫頁面

      // 如果行被點擊，更改其樣式以表示選中狀態
      toggleClickedStyle(rows, row);
    });
  });
});

// 切換行的選中樣式
function toggleClickedStyle(rows, selectedRow) {
  // 如果行被點擊，更改其樣式以表示選中狀態
  if (!selectedRow.classList.contains("clicked")) {
    // 首先移除其他所有行的"clicked"類
    rows.forEach((row) => {
      row.classList.remove("clicked");
    });
    // 然後為被點擊的行添加"clicked"類
    selectedRow.classList.add("clicked");
  } else {
    // 如果再次點擊同一行，移除"clicked"類
    selectedRow.classList.remove("clicked");
  }
}

/* // 為每一行加上點擊事件監聽
rows.forEach((row) => {
  row.addEventListener("click", function () {
    // 移除其他行的選中樣式
    rows.forEach((r) => r.classList.remove("selected"));

    // 為當前被點擊的行加上選中樣式
    row.classList.add("selected");
  });
}); */

// --------------------------- Page 2--------------------------- //
// back-page回上頁
document.querySelector(".back-page").addEventListener("click", function () {
  window.history.back();
});

// 獲取模態框和按鈕元素
var modal = document.getElementById("myModal");
var btn = document.getElementById("condition-btn");

// 當按鈕被點擊時，打開模態框
btn.onclick = function () {
  modal.style.display = "block";
};

// 當點擊模態框外部區域時，關閉模態框
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.getElementById("image-input").addEventListener("change", function (e) {
  const image = document.getElementById("uploaded-image");
  const placeholder = document.querySelector(".placeholder-text");

  if (e.target.files && e.target.files[0]) {
    var reader = new FileReader();

    reader.onload = function (event) {
      image.src = event.target.result;
      image.style.display = "block";
      placeholder.style.display = "none";
    };

    reader.readAsDataURL(e.target.files[0]);
  }
});

function removeImage() {
  const image = document.getElementById("uploaded-image");
  const placeholder = document.querySelector(".placeholder-text");
  image.src = "";
  image.style.display = "none";
  placeholder.style.display = "block";
}
