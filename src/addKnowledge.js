// 全局变量用于存储上传的图片数据
let uploadedImages = {
  modelImage: '',
  toolsImage: '',
  positionImage: '',
};

// 此函數用於處理圖片選擇後的變更，更新顯示並保存到localStorage
function handleImageChange(type, imageInput) {
  console.log(imageInput); // 查看imageInput是否正确
    const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          
          // 保存圖片的 base64 编码到 uploadedImages 對象
          uploadedImages[type] = e.target.result;
          
          // 直接更新對應的 <img> 標籤來顯示圖片
          const imageElement = document.getElementById(type);
          if (imageElement) {
            imageElement.src = e.target.result;
            imageElement.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
}


// 更新圖片顯示
function updateImageDisplay(imageElement, imageUrl) {
  if (imageUrl) {
    imageElement.src = imageUrl;
    imageElement.style.display = "block";
  } else {
    imageElement.style.display = "none";
  }
}


document.addEventListener("DOMContentLoaded", function () {
  // 為圖片的上傳按鈕添加事件處理器
  document
    .querySelector(".upload-btn-model")
    .addEventListener("click", function () {
      uploadImage("modelImage");
    });

  // 為圖片的刪除按鈕添加事件處理器
  document
    .querySelector(".delete-btn-model")
    .addEventListener("click", function () {
      removeImage("modelImage");
    });

  document
    .querySelector(".upload-btn-tools")
    .addEventListener("click", function () {
      uploadImage("toolsImage");
    });

  document
    .querySelector(".delete-btn-tools")
    .addEventListener("click", function () {
      removeImage("toolsImage");
    });

  document
    .querySelector(".upload-btn-position")
    .addEventListener("click", function () {
      uploadImage("positionImage");
    });

  document
    .querySelector(".delete-btn-position")
    .addEventListener("click", function () {
      removeImage("positionImage");
    });


  // 上傳圖片功能
  function uploadImage(type) {
    const imageInput = document.getElementById(`${type}-image-input`);
    
    // 直接为 onchange 事件赋值，只需要设置一次即可
    imageInput.onchange = () => handleImageChange(type, imageInput);
    imageInput.click();

    // imageInput.onchange = () => {
    //   const file = imageInput.files[0];
    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onload = function (e) {
          
    //       // 保存圖片的 base64 编码到 uploadedImages 對象
    //       uploadedImages[type] = e.target.result;
          
    //       // 直接更新對應的 <img> 標籤來顯示圖片
    //       const imageElement = document.getElementById(type);
    //       if (imageElement) {
    //         imageElement.src = e.target.result;
    //         imageElement.style.display = 'block';
    //       }
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // };
  }

  
  // 修改刪除圖片功能，以便從 localStorage 中移除圖片數據
  function removeImage(type) {
    // 组装对应的input和img元素的ID
    const inputId = `${type}-image-input`;
    const imageId = type;
  
    // 获取对应的DOM元素
    const inputElement = document.getElementById(inputId);
    const imgElement = document.getElementById(imageId);
  
    // 清除input元素的值，隐藏和清除img元素的图片
    if (inputElement && imgElement) {
      inputElement.value = ""; // 清除input元素的已选文件
      imgElement.style.display = "none"; // 隐藏img元素
      imgElement.src = ""; // 清除img元素的源
  
      // 如果使用了全局变量来追踪上传的图片数据
      if (uploadedImages[type]) {
        uploadedImages[type] = ''; // 清除全局变量中的数据
      }
    }
  }
  
  // 初始化时恢复图片显示
  restoreImages();

});

// 删除图片功能
document
  .querySelectorAll(".image-actions button#delete-btn")
  .forEach(function (button) {
    button.addEventListener("click", function () {
      const imageBox = this.parentElement.previousElementSibling;
      const imageBoxId = imageBox.getAttribute("data-id");
      let imagesData = JSON.parse(localStorage.getItem(imageBoxId) || "[]");

      // 此处需要确定如何选择要删除的图片，假设删除最后一张
      imagesData.pop(); // 如果有具体的图片索引，使用 splice(index, 1)

      localStorage.setItem(imageBoxId, JSON.stringify(imagesData));
      updateImageDisplay(imageBoxId);
    });
  });

// 隐藏或顯示文本和圖片
function togglePlaceholderAndImageDisplay() {
  document.querySelectorAll(".uploaded-image").forEach(function (img) {
    // 检查图片元素是否已加载图片
    if (img.src && img.src !== window.location.href) {
      // 确保 src 不是当前页面的 URL
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }
  });
}

// ---------------------------------------------------------------------------

// 儲存按鈕記錄歷史資料
let isOpen = false;
let savedOptions = localStorage.getItem("options")
  ? JSON.parse(localStorage.getItem("options"))
  : [];

// 获取输入框、下拉箭头和下拉选项列表
const inputFields = document.querySelectorAll(".fault-Info");
const dropdownArrows = document.querySelectorAll(".drop-down-arrow");
const datalists = document.querySelectorAll(".custom-datalist");

// 初始时隐藏所有下拉选项列表
datalists.forEach(function (datalist) {
  datalist.style.display = "none";
});

// 添加点击事件处理程序以展开/收起下拉选项列表
inputFields.forEach(function (inputField, index) {
  inputField.addEventListener("click", function () {
    if (datalists[index]) {
      datalists[index].style.display =
        datalists[index].style.display === "none" ? "block" : "none";
    }
    isOpen = !isOpen;
  });
});

// 為每個 .drop-down-arrow 添加點擊事件處理器
dropdownArrows.forEach(function (arrow, index) {
  arrow.addEventListener("click", function () {
    datalists[index].style.display =
      datalists[index].style.display === "none" ? "block" : "none";
    isOpen = !isOpen;
  });
});

// 添加点击事件处理程序以选择选项并修改输入框文本颜色
datalists.forEach(function (datalist, index) {
  datalist.addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "li") {
      inputFields[index].value = event.target.getAttribute("data-value");
      inputFields[index].style.color = "#000";
      datalists[index].style.display = "none";
      isOpen = false;
    }
  });
});

// 当失去焦点时，延迟隐藏下拉选项列表
inputFields.forEach(function (inputField, index) {
  inputField.addEventListener("blur", function () {
    setTimeout(function () {
      if (datalists[index]) { // 新增的檢查
        datalists[index].style.display = "none";
      }
      isOpen = false;
    }, 150);
  });
});

// 当输入框内容发生变化时，根据内容更改文本颜色
inputFields.forEach(function (inputField) {
  inputField.addEventListener("input", function () {
    const inputValue = this.value;
    this.style.color = inputValue ? "#000" : "gray";
  });
});

// 初始化显示保存的选项
showOptions();

// 在文档加载完成后显示保存的选项
document.addEventListener("DOMContentLoaded", function () {
  // 初始化顯示之前儲存的選項
  showOptions(); // 顯示歷史選項
  togglePlaceholderAndImageDisplay(); // 调用函数以设置正确的显示状态 (圖片內容)

  restoreInputValues();
  restoreRightSideContent(); // 恢复右侧内容（文本和图片）
  restoreImages(); // 调用一次，统一恢复所有图像
});


// 儲存歷史記錄的函數
function saveOption(name, value) {
  let history;
  try {
    // 尝试解析存储的数据
    history = JSON.parse(localStorage.getItem(name) || "[]");
  } catch (e) {
    // 如果解析失败，设置为空数组
    history = [];
  }

  // 检查解析后的 history 是否确实是一个数组
  if (!Array.isArray(history)) {
    history = [];
  }

  if (!history.includes(value)) {
    history.push(value);
    // 保存数据到本地存储
    localStorage.setItem(name, JSON.stringify(history));
  }

  // 檢查選項是否已存在
  if (!savedOptions.includes(value)) {
    savedOptions.push(value);
    localStorage.setItem("options", JSON.stringify(savedOptions));
  }
}

function showOptions() {
  document.querySelectorAll(".custom-select").forEach(function (customSelect) {
    let inputField = customSelect.querySelector(".fault-Info");
    let historyList = customSelect.querySelector(".custom-datalist");

    if (inputField && historyList) {
      let storedData = localStorage.getItem(inputField.name);
      let history;

      if (storedData) {
        try {
          history = JSON.parse(storedData);
        } catch (e) {
          console.error(
            "解析錯誤，鍵名：" + inputField.name + ", 數據：" + storedData,
            e
          );
          history = [];
        }
      } else {
        storedData = ""; // 確保變量已定義
        history = [];
      }

      historyList.innerHTML = "";
      history.forEach((item) => {
        let li = document.createElement("li");
        li.textContent = item;
        li.setAttribute("data-value", item);
        li.onclick = function () {
          inputField.value = item;
          historyList.style.display = "none";
        };
        historyList.appendChild(li);
      });
    }
  });
}

document.querySelectorAll(".drop-down-arrow").forEach(function (arrow) {
  arrow.addEventListener("click", function () {
    var dropdownList = this.nextElementSibling;
    dropdownList.classList.toggle("show"); // 这里使用 'show' 类来控制显示
  });
});

// 保存左側文字內容顯示
function saveLeftSideContent() {
  inputFields.forEach(function (inputField) {
    const inputValue = inputField.value;
    if (inputValue) {
      // 保存當前輸入值並更新歷史列表
      saveOption(inputField.name, inputValue);
      // 保存當前的輸入值為最後輸入值
      localStorage.setItem(inputField.name + "-last", inputValue);
    } else {
      // 如果沒有輸入值，則移除最後輸入值
      localStorage.removeItem(inputField.name + "-last");
    }
  });
}

// 保存右側文字內容顯示
function saveRightSideContent() {
  document
    .querySelectorAll(".content-box-right .text-box")
    .forEach(function (textarea) {
      localStorage.setItem(textarea.name, textarea.value);
    });
}

// 恢復左側輸入框的值
function restoreInputValues() {
  inputFields.forEach(function (inputField) {
    // 獲取最後輸入的值
    const savedValue = localStorage.getItem(inputField.name + "-last");
    if (savedValue) {
      inputField.value = savedValue;
    } else {
      inputField.value = ""; // 如果沒有保存的值，則清空輸入框
    }
  });
}

// 恢复右側输入字段的值
function restoreRightSideContent() {
  document
    .querySelectorAll(".content-box-right .text-box")
    .forEach(function (textarea) {
      const savedValue = localStorage.getItem(textarea.name);
      if (savedValue) {
        textarea.value = savedValue;
      }
    });
}

// 恢复右侧上传图片的内容
function restoreImages() {
  Object.keys(uploadedImages).forEach((key) => {
    const imageElement = document.getElementById(key);
    if (imageElement) {
      if (uploadedImages[key]) {
        imageElement.src = uploadedImages[key];
        imageElement.style.display = 'block';
      } else {
        imageElement.style.display = 'none';
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", restoreImages);
