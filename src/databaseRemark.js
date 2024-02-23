/* // 获取模态框内的<img>元素
var modalImageRemark = document.getElementById("modalImage-remark");

// 获取備註補充内的<img>元素
var remarkImage = document.querySelector("#modalNotesSection .modal-image");

// 创建一个函数，用于将模态框内的<img>替换为備註補充内的<img>
function replaceImageInModal() {
  // 获取模态框内的<img>的src属性
  var modalImageSrc = modalImageRemark.src;

  // 将模态框内的<img>的src属性设置为備註補充内的<img>的src属性
  remarkImage.src = modalImageSrc;
}

// 将替换函数与模态框内的按钮关联
var replaceImageButton = document.getElementById("replaceImageButton");
replaceImageButton.addEventListener("click", replaceImageInModal);
 */
