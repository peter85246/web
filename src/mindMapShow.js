// 获取中心节点并添加类名
const centralNode = document.getElementById("central-node");
centralNode.classList.add("node", "central-node", "level-0");

// 存储每个父节点的子节点数量
const childrenCount = {};

// 创建连接线的函数
function createLine(from, to, side) {
  // 移除现有的 SVG 和相关的删除按钮（如果存在）
  let existingSvg = document.querySelector(
    `svg[data-from="${from.id}"][data-to="${to.id}"]`
  );
  if (existingSvg) {
    let existingDeleteBtn = document.querySelector(
      `.delete-btn[data-for="${to.id}"]`
    );
    existingDeleteBtn?.remove();
    existingSvg.remove();
  }

  // 创建新的 SVG 元素
  const svgNS = "http://www.w3.org/2000/svg";
  svg = document.createElementNS(svgNS, "svg");
  path = document.createElementNS(svgNS, "path");
  svg.appendChild(path);

  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.overflow = "visible"; // 防止路径被裁剪
  svg.classList.add("connection-line");
  svg.dataset.from = from.id;
  svg.dataset.to = to.id;

  document.body.appendChild(svg);

  // 获取起点和终点的坐标
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();

  let startX, startY, endX, endY;
  if (side === "left") {
    startX = fromRect.left + window.scrollX; // 中心节点左侧
    endX = toRect.right + window.scrollX; // 子节点右侧
  } else {
    // 对于右侧节点的逻辑保持不变
    startX = fromRect.right + window.scrollX; // 中心节点右侧
    endX = toRect.left + window.scrollX; // 子节点左侧
  }

  startY = fromRect.top + fromRect.height / 2 + window.scrollY;
  endY = toRect.top + toRect.height / 2 + window.scrollY;

  // 设置贝塞尔曲线路径
  const pathD = `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${
    (startX + endX) / 2
  } ${endY}, ${endX} ${endY}`;
  path.setAttribute("d", pathD);
  path.setAttribute("stroke", "#0d64c0");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("fill", "none");

  /* // 创建并设置删除图标
  const deleteBtn = document.createElement('div')
  deleteBtn.classList.add('delete-btn', 'hidden')
  deleteBtn.textContent = '-'
  deleteBtn.style.position = 'absolute'
  deleteBtn.style.left = `${(startX + endX) / 2 - 9}px`
  deleteBtn.style.top = `${(startY + endY) / 2 - 9}px`
  deleteBtn.setAttribute('data-for', to.id)

  // 点击删除图标时的行为
  deleteBtn.addEventListener('click', () => {
    deleteBranch(to)
    deleteBtn.remove()
  })

  document.body.appendChild(deleteBtn)

  // 显示删除图标的逻辑
  const showDeleteBtn = () => deleteBtn.classList.remove('hidden')
  const hideDeleteBtn = () => deleteBtn.classList.add('hidden')

  // 鼠标悬停在 SVG 或删除图标上时显示删除图标
  svg.addEventListener('mouseenter', showDeleteBtn)
  deleteBtn.addEventListener('mouseenter', showDeleteBtn)

  // 鼠标离开 SVG 或删除图标时隐藏删除图标
  svg.addEventListener('mouseleave', hideDeleteBtn)
  deleteBtn.addEventListener('mouseleave', hideDeleteBtn) */
}

// 实现删除分支的函数
function deleteBranch(node) {
  // 删除子节点
  if (childrenCount[node.id]) {
    [...childrenCount[node.id].left, ...childrenCount[node.id].right].forEach(
      (childId) => {
        const childNode = document.getElementById(childId);
        if (childNode) {
          deleteBranch(childNode); // 递归删除子节点
        }
      }
    );
  }

  // 删除与子节点关联的连接线和删除按钮
  const associatedLines = document.querySelectorAll(
    `.connection-line[data-to="${node.id}"], .connection-line[data-from="${node.id}"]`
  );
  associatedLines.forEach((line) => {
    // 删除与线关联的删除按钮
    const deleteBtn = document.querySelector(
      `.delete-btn[data-for="${line.dataset.to}"]`
    );
    deleteBtn?.remove();
    line.remove();
  });

  // 删除节点本身
  node.remove();

  // 更新父节点的子节点计数
  const parentId = node.getAttribute("data-parent-id");
  if (parentId) {
    const parentSide = node.getAttribute("data-side");
    childrenCount[parentId][parentSide] = childrenCount[parentId][
      parentSide
    ].filter((id) => id !== node.id);

    // 如果父节点存在，则更新其余子节点的位置
    const parent = document.getElementById(parentId);
    const level = parseInt(node.getAttribute("data-level"), 10);
    updateChildrenPositions(
      parentId,
      level,
      parentSide,
      levelSpacing[level],
      childrenCount[parentId][parentSide]
    );
  }

  // 更新其余子节点的位置
  if (parentId) {
    const parent = document.getElementById(parentId);
    const level = parseInt(node.getAttribute("data-level"), 10);
    updateChildrenPositions(
      parentId,
      level,
      parentSide,
      levelSpacing[level],
      childrenCount[parentId][parentSide]
    );
  }

  // 删除关联的删除按钮
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    if (btn.nextSibling === node) {
      btn.remove();
    }
  });
}

// 实现删除分支的函数
function deleteBranch(node) {
  // 如果子节点有自己的子节点，则递归删除
  if (childrenCount[node.id]) {
    childrenCount[node.id].left
      .concat(childrenCount[node.id].right)
      .forEach((childId) => {
        const childNode = document.getElementById(childId);
        if (childNode) {
          deleteBranch(childNode); // 递归删除子节点
        }
      });
  }

  // 删除与子节点关联的连接线和删除按钮
  const associatedLines = document.querySelectorAll(
    `.connection-line[data-to="${node.id}"]`
  );
  associatedLines.forEach((line) => {
    const deleteBtn = document.querySelector(
      `.delete-btn[data-for="${line.dataset.to}"]`
    );
    deleteBtn?.remove();
    line.remove();
  });

  // 删除节点本身
  node.remove();

  // 更新父节点的子节点计数
  const parentId = node.getAttribute("data-parent-id");
  if (parentId) {
    const parentSide = node.getAttribute("data-side");
    childrenCount[parentId][parentSide] = childrenCount[parentId][
      parentSide
    ].filter((id) => id !== node.id);

    // 如果父节点存在，则更新其余子节点的位置
    const parent = document.getElementById(parentId);
    const level = parseInt(node.getAttribute("data-level"), 10);
    updateChildrenPositions(
      parentId,
      level,
      parentSide,
      levelSpacing[level],
      childrenCount[parentId][parentSide]
    );
  }

  // 更新其余子节点的位置
  if (parentId) {
    const parent = document.getElementById(parentId);
    const level = parseInt(node.getAttribute("data-level"), 10);
    updateChildrenPositions(
      parentId,
      level,
      parentSide,
      levelSpacing[level],
      childrenCount[parentId][parentSide]
    );
  }

  // 删除关联的删除按钮
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    if (btn.nextSibling === node) {
      btn.remove();
    }
  });
}

// 创建分支的函数
function createBranch(level, parent, side) {
  const parentId = parent.id || parent.getAttribute("data-id");
  if (!childrenCount[parentId]) {
    childrenCount[parentId] = { left: [], right: [] };
  }

  const sideIndex = side === "left" ? "left" : "right";
  // 使用父节点ID、侧面和子节点数量生成唯一ID
  const newId = `node-${parentId}-${sideIndex}-${childrenCount[parentId][side].length}`;
  childrenCount[parentId][side].push(newId);

  const branch = document.createElement("div");
  branch.id = newId;
  branch.classList.add("node", `level-${level}`, "branch", sideIndex);
  branch.textContent = `新分支 ${level}-${childrenCount[parentId][side].length}`;
  document.body.appendChild(branch);

  // 使用 setTimeout 延时更新连线
  setTimeout(() => {
    createLine(parent, branch, side);
  }, 0);

  branch.style.position = "absolute";

  // 设置分支间距
  const levelSpacing = [0, 150, 90, 40]; // Level-0 到 Level-3 的垂直间距
  const spacing = levelSpacing[level];

  // 更新子节点位置
  updateChildrenPositions(
    parentId,
    level,
    side,
    spacing,
    childrenCount[parentId][side]
  );

  // 立即绘制连线
  createLine(parent, branch, side);

  // 如果不是最后一级节点，添加添加按钮
  /* if (level < 3) {
    const addButton = document.createElement('div')
    addButton.classList.add('add-btn', side)
    addButton.textContent = '+'
    addButton.style.visibility = 'hidden'

    // 请确保 "+" 按钮不会被错误地作为子节点的一部分
    addButton.setAttribute('data-id', 'add-button') // 使用 data-id 而不是 id
    addButton.addEventListener('click', (event) => {
      event.stopPropagation()
      createBranch(level + 1, branch, side)
    })
    branch.appendChild(addButton)

    branch.addEventListener('mouseover', () => {
      addButton.style.visibility = 'visible'
    })

    branch.addEventListener('mouseout', () => {
      addButton.style.visibility = 'hidden'
    })
  } */

  branch.setAttribute("data-level", level);
  branch.setAttribute("data-side", side);
  branch.setAttribute("data-id", newId);
  // 在新创建的分支上存储父节点的ID和它所处的侧面
  branch.setAttribute("data-parent-id", parent.id);
  branch.setAttribute("data-side", side);

  // 绘制连接线
  createLine(parent, branch, side);

  // 为分支添加拖拽功能
  enableDrag(branch);
}

// 更新子节点的位置
function updateChildrenPositions(parentId, level, side, spacing, childIds) {
  const parent = document.getElementById(parentId);
  const parentRect = parent.getBoundingClientRect();

  let lastY = -Infinity;

  childIds.forEach((id, index) => {
    const child = document.getElementById(id);
    if (!child) {
      console.error("updateChildrenPositions: Child element not found.", id);
      return;
    }

    let yPos = parentRect.top + (index - (childIds.length - 1) / 2) * spacing;
    if (yPos < lastY + child.offsetHeight) {
      yPos = lastY + child.offsetHeight + 10; // 防止重叠
    }

    child.style.top = `${yPos}px`;
    lastY = yPos;

    // 设置子节点的左或右位置
    if (side === "left") {
      child.style.left = `${
        parentRect.left - child.offsetWidth - 35
      }px`; /* 欄位水平間距*/
    } else {
      child.style.left = `${parentRect.right + 35}px`;
    }

    createLine(parent, child, side); // 更新连线
  });
}

// 添加点击事件监听器到level-3分支，點選導入資料庫頁面
/* document.addEventListener('click', function (event) {
  if (isDragging) {
    // 如果是在拖拽后立即发生的点击，阻止事件处理
    return
  }

  const clickedNode = event.target

  // 检查点击的节点是否是level-3分支
  if (clickedNode.classList.contains('level-3')) {
    // 获取分支的数据（例如分支的文本内容）
    const branchData = {
      text: clickedNode.textContent,
      // 添加其他需要传递的数据字段
    }

    // 调用函数将分支数据传递到database.html页面
    navigateToDatabasePageWithBranchData(branchData)
  }
}) */

/*---------------------- 資料呈現為主，待日後刪除 -----------------------------*/
// 函数：将分支数据传递到database.html页面
function navigateToDatabasePageWithBranchData(branchData) {
  // 构建要传递的数据字符串
  const dataString = JSON.stringify(branchData);

  // 导航到database.html页面，并将数据作为查询参数传递
  window.location.href = `database-alarm.html?data=${encodeURIComponent(
    dataString
  )}`;
}

// 绑定添加按钮事件
document.querySelectorAll(".add-btn.left, .add-btn.right").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const side = button.classList.contains("left") ? "left" : "right";
    const parent = button.closest(".node");
    const parentId = parent.getAttribute("data-id") || parent.id;
    createBranch(1, parent, side);
  });
});

// 初始化中心节点的添加按钮
/* function initAddButtons() {
  ;['left', 'right'].forEach((side) => {
    const addButton = document.createElement('div')
    addButton.classList.add('add-btn', side)
    addButton.textContent = '+'
    centralNode.appendChild(addButton)

    addButton.addEventListener('click', (event) => {
      event.stopPropagation()
      createBranch(1, centralNode, side)
    })
  })
} */

// 添加鼠标拖拽功能
function enableDrag(element) {
  let offsetX, offsetY;

  element.onmousedown = function (e) {
    isDragging = false; // 重置拖拽状态
    e.preventDefault();
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    document.onmousemove = startDrag;
    document.onmouseup = stopDrag;
  };

  function startDrag(e) {
    isDragging = true; // 设置拖拽状态
    e.preventDefault();
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
    element.style.right = "initial";

    // 更新父节点与子节点的连接线
    updateParentAndChildLines(element);

    // 更新删除按钮的位置
    updateDeleteButtonPosition(element);
  }

  function stopDrag(e) {
    if (isDragging) {
      // 拖拽后的处理
      e.preventDefault();
      e.stopPropagation(); // 阻止事件冒泡
    }
    document.onmousemove = null;
    document.onmouseup = null;

    setTimeout(() => {
      isDragging = false; // 使用全局变量
    }, 0); // 拖拽结束后重置标志
  }
}

function updateParentAndChildLines(element) {
  const parent = document.getElementById(
    element.getAttribute("data-parent-id")
  );
  const side = element.getAttribute("data-side");

  if (parent) {
    createLine(parent, element, side);
  }

  if (childrenCount[element.id]) {
    childrenCount[element.id].left
      .concat(childrenCount[element.id].right)
      .forEach((childId) => {
        const child = document.getElementById(childId);
        if (child) {
          createLine(element, child, child.getAttribute("data-side"));
        }
      });
  }

  // 更新删除按钮的位置
  const deleteBtn = document.querySelector(
    `.delete-btn[data-for="${element.id}"]`
  );
  if (deleteBtn) {
    const fromRect = parent.getBoundingClientRect();
    const toRect = element.getBoundingClientRect();
    const startX =
      side === "left"
        ? fromRect.left + window.scrollX
        : fromRect.right + window.scrollX;
    const endX =
      side === "left"
        ? toRect.right + window.scrollX
        : toRect.left + window.scrollX;
    const startY = fromRect.top + fromRect.height / 2 + window.scrollY;
    const endY = toRect.top + toRect.height / 2 + window.scrollY;

    const deleteBtnX = (startX + endX) / 2 - 9; // 图标宽度的一半
    const deleteBtnY = (startY + endY) / 2 - 9; // 图标高度的一半
    deleteBtn.style.left = `${deleteBtnX}px`;
    deleteBtn.style.top = `${deleteBtnY}px`;
  }
}

// 更新与特定节点相关的连接线
function updateLines(element) {
  // 获取所有连接线
  const connections = document.querySelectorAll(
    `.connection-line[data-from="${element.id}"], .connection-line[data-to="${element.id}"]`
  );

  connections.forEach((svg) => {
    // 重绘每一条连接线
    const fromElement = document.getElementById(svg.dataset.from);
    const toElement = document.getElementById(svg.dataset.to);
    const side = fromElement.classList.contains("left") ? "left" : "right";
    createLine(fromElement, toElement, side);
  });
}
