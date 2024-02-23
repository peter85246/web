// 页面加载完成时执行的函数
window.onload = function () {
  // 从 localStorage 读取选中的 row 的数据
  const data = JSON.parse(localStorage.getItem("selectedRowData"));
  if (data) {
    const rowDatabase = document.querySelector(".row-database");
    const cells = rowDatabase.querySelectorAll("td");
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerText = data[i];
    }
  }

  // 为保存按钮添加事件监听器
  document
    .querySelector(".btn-save")
    .addEventListener("click", function (event) {
      event.preventDefault(); // 防止页面刷新
      handleSaveButton();
    });

  // 为新增图片和关闭按钮添加事件监听器
  addImageBtn.addEventListener("click", createFileInputAndAddImage);
  addImageBtnRemark.addEventListener("click", createFileInputAndAddImage);
  closeBtn.addEventListener("click", closeModal);

  // 为每个需要打开模态框的<div>元素添加点击事件
  idsToTriggerModal.forEach(function (id) {
    var div = document.getElementById(id);
    if (div) {
      div.addEventListener("click", function () {
        openModal(id, div);
      });
    }
  });

  // 检查文本区域是否溢出，并应用边框
  checkAndApplyBorderOnOverflow();

  // 为文本区域添加事件监听器，以在输入时检查溢出
  document
    .querySelectorAll(".description-section textarea, .notes-section textarea")
    .forEach((textarea) => {
      textarea.addEventListener("input", checkAndApplyBorderOnOverflow);
    });
};

// 打开模态框并更新其内容
function openModal(id, div) {
  updateModalTitle(id, div); // 更新模态框标题
  loadContentIntoModal(div); // 加載被點擊 div 的內容到模態框
  modalOverlay.style.display = "block"; // 显示遮罩层和模态框
  modal.style.display = "block";
  modal.scrollTop = 0; // 重置滚动条位置

  currentDiv = div; // 保存当前操作的div元素
}

// 將點擊的 div 內容加載到模態框
function loadContentIntoModal(div) {
  // 获取步骤说明文本
  var stepContentBoxText =
    div.querySelector(".step-content-box")?.innerText || "";
  var modalDescription = document.getElementById("modalDescription");
  modalDescription.value = stepContentBoxText; // 设置步骤说明到模态框的文本区

  // 获取备注补充的图片并添加删除功能
  var remarkImageSrc = div.querySelector(".step-content-box img")?.src || "";
  var modalImageRemark = document.getElementById("modalImage-remark");
  handleImageDisplayAndDelete(remarkImageSrc, modalImageRemark);

  // 获取模态框的图片并添加删除功能（原有功能）
  var imgSrc = div.querySelector("img") ? div.querySelector("img").src : ""; // 获取图片地址
  var modalImage = document.getElementById("modalImage");
  handleImageDisplayAndDelete(imgSrc, modalImage);
}

// 处理图片的显示和删除功能
function handleImageDisplayAndDelete(imgSrc, imgContainer) {
  var imageContainerModal = imgContainer.closest(".image-container-modal");

  // 清除现有的删除按钮（如果存在）
  var existingDeleteBtn =
    imageContainerModal.querySelector(".delete-image-btn");
  if (existingDeleteBtn) {
    existingDeleteBtn.remove();
  }

  if (imgSrc) {
    imgContainer.src = imgSrc;
    imageContainerModal.classList.add("has-image");

    // 创建删除按钮
    var deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-image-btn";
    deleteBtn.innerHTML = "&minus;";
    deleteBtn.onclick = function () {
      imgContainer.src = "";
      deleteBtn.remove();
      imageContainerModal.classList.remove("has-image");
    };

    // 将删除按钮添加到图片容器中
    imageContainerModal.appendChild(deleteBtn);
    deleteBtn.style.display = "block"; // 显示删除按钮
  } else {
    imageContainerModal.classList.remove("has-image");
  }
}

// 處理保存按鈕點擊事件
function handleSaveButton() {
  if (currentDiv) {
    var modalDescription = document.getElementById("modalDescription").value;
    var modalNotes = document.getElementById("modalNotes").value;
    var modalImageSrc = document.getElementById("modalImage").src;
    var modalImageRemarkSrc = document.getElementById("modalImage-remark").src;

    // 更新对应 div 的步骤说明文本内容
    updateTextContent(currentDiv, ".step-content-box", modalDescription);

    // 更新对应 div 的图片
    updateImageSrc(
      currentDiv,
      ".image-container-page img, .step-content img, .step-content-box img",
      modalImageSrc
    );

    // 更新对应 div 的备注补充文本和图片
    updateTextContent(
      currentDiv,
      "#remarksContent .step-content-box",
      modalNotes
    );
    updateImageSrc(
      currentDiv,
      "#remarksContent .step-content-box img",
      modalImageRemarkSrc
    );

    closeModal(); // 关闭模态框
  }
}

// 更新文本内容的辅助函数
function updateTextContent(div, selector, newText) {
  var textElement = div.querySelector(selector);
  if (textElement) {
    textElement.innerText = newText;
  }
}

// 更新图片源的辅助函数
function updateImageSrc(div, selector, newSrc) {
  var imgElement = div.querySelector(selector);
  if (imgElement) {
    imgElement.src = newSrc;
  }
}

// ...其余代码保持不变...

// 在保存按钮上添加事件监听器
document.querySelector(".btn-save").addEventListener("click", handleSaveButton);

// 更新模态框标题
function updateModalTitle(id, div) {
  var newTitle = id;
  if (id.startsWith("step")) {
    newTitle = id.charAt(0).toUpperCase() + id.slice(1);
  } else {
    var label = div.querySelector("label");
    if (label) {
      newTitle = label.innerText;
      if (
        !newTitle.includes("SOP名稱") &&
        !newTitle.includes("For Model 機型")
      ) {
        newTitle = newTitle.replace(":", "");
      }
    }
  }
  modalTitle.innerText = newTitle;
  modalTitle.style.fontSize = "1.5em";
}

// 关闭模态框的函数
function closeModal() {
  modalOverlay.style.display = "none";
  modal.style.display = "none";
}

// 添加图片功能
function createFileInputAndAddImage(event) {
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = function (e) {
    handleAddImage(e, event.target.id);
  };
  fileInput.click();
}

// 处理图片添加的函数
function handleAddImage(event, triggeringElementId) {
  var file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var imgContainer;
      var deleteBtn;
      var imageContainerModal;

      if (triggeringElementId === "addImageBtn-remark") {
        imgContainer = document.getElementById("modalImage-remark");
        imageContainerModal = imgContainer.closest(".image-container-modal");
        deleteBtn = document.createElement("span"); // 创建删除按钮
        deleteBtn.className = "delete-image-btn";
        deleteBtn.innerHTML = "&minus;"; // 设置按钮文本为 "-"
        deleteBtn.onclick = function () {
          // 为按钮添加点击事件
          imgContainer.src = ""; // 清除图片
          deleteBtn.remove(); // 删除按钮本身
          // 移除边框
          imageContainerModal.classList.remove("has-image");
        };
      } else {
        imgContainer = document.getElementById("modalImage");
        imageContainerModal = imgContainer.closest(".image-container-modal");
        deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-image-btn";
        deleteBtn.innerHTML = "&minus;";
        deleteBtn.onclick = function () {
          imgContainer.src = "";
          deleteBtn.remove();
          // 移除边框
          imageContainerModal.classList.remove("has-image");
        };
      }

      // 添加图片并显示边框
      imgContainer.src = e.target.result;
      imageContainerModal.classList.add("has-image");
      // 将删除按钮添加到图片容器中
      imgContainer.parentNode.appendChild(deleteBtn);
      deleteBtn.style.display = "block"; // 显示删除按钮
    };
    reader.readAsDataURL(file);
  }
}

// 检查 textarea 是否溢出，并根据需要添加或移除 .textarea-overflow 类
function checkAndApplyBorderOnOverflow() {
  document
    .querySelectorAll(".description-section textarea, .notes-section textarea")
    .forEach((textarea) => {
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.classList.add("textarea-overflow");
      } else {
        textarea.classList.remove("textarea-overflow");
      }
    });
}

// 全局变量定义
var modal = document.getElementById("fileModal");
var modalOverlay = document.getElementById("modalOverlay");
var modalTitle = document.querySelector(".modal-title-database");
var addImageBtn = document.getElementById("addImageBtn");
var addImageBtnRemark = document.getElementById("addImageBtn-remark");
var closeBtn = document.getElementById("closeModalBtn");
var modalImage = document.getElementById("modalImage");
var currentDiv = null;
var idsToTriggerModal = ["step1", "step2", "step3", "step4"];
