// 欄位點擊進入資料庫
document.addEventListener("DOMContentLoaded", function () {
  // 獲取所有.row類別的tr元素
  let rows = document.querySelectorAll(".row");

  // 為每一個tr元素添加點擊事件
  rows.forEach(function (row) {
    row.addEventListener("click", function () {
      window.location.href = "databaseQuery.html";
    });
  });
});

// ------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  let sopNumber = 1;
  let draggedItem;
  let lastContent; // 儲存被拖動的項目的內容

  // 初始化各個元素
  const openModalBtn = document.getElementById("openModalBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const sopNumberLabel = document.getElementById("sopNumberLabel");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  let lastClickedItem;

  // 搜尋功能
  const searchInput = document.getElementById("search");
  const conditionItems = document.querySelectorAll(".condition-item");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();

      conditionItems.forEach((item) => {
        const itemContent = item
          .querySelector("span")
          .textContent.toLowerCase();
        if (itemContent.includes(query)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  function updateSearchHistory(query) {
    // 如果此查詢已存在，則刪除它
    const index = searchHistory.indexOf(query);
    if (index > -1) {
      searchHistory.splice(index, 1);
    }

    // 添加新查詢到開頭
    searchHistory.unshift(query);

    // 限制到3個項目
    if (searchHistory.length > 3) {
      searchHistory = searchHistory.slice(0, 3);
    }

    // 更新localStorage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  // 初始化可拖動的項目事件
  const initializeDraggableEvents = (item) => {
    item.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData(
        "text/plain",
        e.target.querySelector("span").textContent
      );
      draggedItem = item;
      lastContent = e.target.querySelector("span").textContent;
    });

    // 鼠標滑過事件處理
    item.addEventListener("mouseover", function () {
      this.style.backgroundColor = "#e4e4e4";
    });

    // 鼠標移開事件處理
    item.addEventListener("mouseout", function () {
      if (lastClickedItem !== this) {
        this.style.backgroundColor = "#FFFFFF";
      }
    });

    // 雙擊事件處理
    item.addEventListener("dblclick", function () {
      const faultInfoBoxes = document.querySelectorAll(".fault-Info");
      for (let i = 0; i < faultInfoBoxes.length; i++) {
        if (!faultInfoBoxes[i].value) {
          faultInfoBoxes[i].value = item.querySelector("span").textContent;
          item.remove();
          break;
        }
      }
    });

    // 單擊事件處理
    item.addEventListener("click", function () {
      if (lastClickedItem && lastClickedItem !== item) {
        lastClickedItem.style.backgroundColor = "#FFFFFF"; // 上次點擊的項目恢復為白色
      }
      if (!lastClickedItem || lastClickedItem !== item) {
        item.style.backgroundColor = "#e4e4e4"; // 當前點擊項目背景色為淺灰色
        lastClickedItem = item;
      }
    });

    // 點擊其他地方的事件處理
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".condition-item") && lastClickedItem) {
        lastClickedItem.style.backgroundColor = "#FFFFFF";
        lastClickedItem = null; // 重置最後點擊的項目
      }
    });
  };

  const draggableItems = document.querySelectorAll(".condition-item");
  draggableItems.forEach(initializeDraggableEvents);

  const dropTargets = document.querySelectorAll(".fault-Info");

  // 處理放置目標事件
  dropTargets.forEach((dropTarget) => {
    dropTarget.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    dropTarget.addEventListener("drop", function (e) {
      e.preventDefault();
      const content = e.dataTransfer.getData("text/plain");

      // 檢查fault-Info欄位是否已有內容，並將其返回到condition-item
      if (dropTarget.value) {
        const scrollBox = document.querySelector(".scroll-box");
        if (scrollBox) {
          const item = document.createElement("div");
          item.classList.add("condition-item");
          item.draggable = true;
          item.innerHTML = `
          <span>${dropTarget.value}</span>
          <div class="icon" style="margin-right: -10px;">≡</div>
        `;

          item.style.backgroundColor = "#e4e4e4";
          item.style.margin = "0";
          item.style.padding = "5px 10px";
          item.style.border = "1px solid #ccc";
          item.style.height = "43px";

          initializeDraggableEvents(item);
          scrollBox.appendChild(item);
          scrollBox.scrollTop = scrollBox.scrollHeight;
        }
      }

      dropTarget.value = content;
      dropTarget.style.color = "black";
      if (draggedItem) draggedItem.remove();
    });

    // 在每次輸入之前，保存當前的值
    dropTarget.addEventListener("keydown", function () {
      this.previousValue = this.value;
    });

    // 輸入事件修正，當刪除所有內容時，返回condition-item與文本和圖標
    dropTarget.addEventListener("input", function () {
      this.style.color = "black";
      const scrollBox = document.querySelector(".scroll-box");
      if (!this.value && scrollBox) {
        const item = document.createElement("div");
        item.classList.add("condition-item");
        item.draggable = true;

        // 使用當前的dropTarget的previousValue來創建condition-item
        item.innerHTML = `
            <span>${this.previousValue}</span>
            <div class="icon" style="margin-right: -10px;">≡</div>
          `;

        item.style.backgroundColor = "#FFFFFF";
        item.style.margin = "0";
        item.style.padding = "5px 10px";
        item.style.border = "1px solid #ccc";
        item.style.height = "43px";

        initializeDraggableEvents(item);
        scrollBox.appendChild(item);
        scrollBox.scrollTop = scrollBox.scrollHeight; // 滾動至底部，確保最後一個項目完整顯示
        this.previousValue = null; // 重設previousValue
      }

      // 確保返回的最後一個項目在scroll-box內部完整顯示
      const itemHeight = item.getBoundingClientRect().height;
      const scrollBoxBottom = scrollBox.getBoundingClientRect().bottom;
      const newItemBottom = item.getBoundingClientRect().bottom;

      if (newItemBottom > scrollBoxBottom) {
        scrollBox.scrollTop += newItemBottom - scrollBoxBottom + 10; // 適當的微調，例如10px
      }
    });
  });

  // 模態視窗事件處理
  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (sopNumberLabel) {
        sopNumberLabel.innerText = "編號：" + sopNumber;
      }
      modalOverlay.style.display = "flex";
    });
  }

  [cancelBtn, closeModalBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        modalOverlay.style.display = "none";
      });
    }
  });

  // 點擊"條件查詢"擊跳出彈出式視窗
  let conditionBtn = document.querySelector(".condition-btn");

  if (conditionBtn && modalOverlay) {
    conditionBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modalOverlay.style.display = "flex";
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modalOverlay.style.display = "none";
    });
  }

  if (saveBtn && openModalBtn) {
    saveBtn.addEventListener("click", function () {
      openModalBtn.innerText = "編輯";
    });
  }

  document.addEventListener("dragend", function () {
    if (draggedItem) draggedItem.style.opacity = "1";
  });

  document.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  document.addEventListener("drop", function (e) {
    e.preventDefault();
    const faultInfo = e.target.closest(".fault-Info");
    if (draggedItem && faultInfo) {
      faultInfo.appendChild(draggedItem);
    }
  });
});
