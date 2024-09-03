const modeButton = document.getElementById("lightBtn");
const createToDo = document.getElementById("createTodo");
const displayList = document.getElementById("displayList");

// Array to store list items
let newItem = [];

// Load saved list items and theme mode from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  // Load saved to-do items
  const savedItems = JSON.parse(localStorage.getItem("todoList")) || [];
  newItem = savedItems.map((itemData) => createListItem(itemData));

  // Append each saved list item to the display list
  newItem.forEach((item) => displayList.appendChild(item));

  // Update the item count on page load
  updateItemCount();

  // Load saved theme mode
  const savedMode = localStorage.getItem("themeMode") || "dark"; // Default to dark mode
  if (savedMode === "light") {
    applyLightMode();
  } else {
    applyDarkMode();
  }

  // Load saved footer color
  const savedFooterColor =
    localStorage.getItem("footerColor") || "hsl(235, 24%, 19%)"; // Default to dark mode color
  document.getElementById("footerDisplay").style.backgroundColor =
    savedFooterColor;

  // Display all items by default and select 'All' button
  showAllItems();
});

// Light/Dark Modes
modeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_body");
  createToDo.classList.toggle("light_input");

  const sunIcon = document.getElementById("sunIcon");
  if (isLightMode) {
    sunIcon.src = "./images/icon-moon.svg";
    applyLightMode();
    localStorage.setItem("themeMode", "light");
    localStorage.setItem("footerColor", "hsl(236, 33%, 92%)"); // Save footer color
  } else {
    sunIcon.src = "./images/icon-sun.svg";
    applyDarkMode();
    localStorage.setItem("themeMode", "dark");
    localStorage.setItem("footerColor", "hsl(235, 24%, 19%)"); // Save footer color
  }
  saveToLocalStorage(); // Ensure color is saved with theme
});

// Function to update the item count for active (unchecked) items only
function updateItemCount() {
  const activeItemCount = newItem.filter(
    (item) => !item.querySelector("p").classList.contains("completed")
  ).length;

  const itemsCountElement = document.getElementById("itemsCount");
  itemsCountElement.textContent = activeItemCount;

  const hasCompletedItems = newItem.some((item) =>
    item.querySelector("p").classList.contains("completed")
  );
  document.getElementById("clearBtn").style.display =
    activeItemCount > 0 || hasCompletedItems ? "block" : "none";
  document.getElementById("footerMenu").style.display =
    activeItemCount > 0 || hasCompletedItems ? "block" : "none";
}

// To-Do List Render
createToDo.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    if (createToDo.value.trim() !== "") {
      const newItemData = {
        text: createToDo.value.trim(),
        completed: false,
      };

      const list = createListItem(newItemData);

      newItem.push(list);
      displayList.appendChild(list);

      saveToLocalStorage();
      updateItemCount();
      createToDo.value = "";
    }
  }
});

// Function to create a new list item with an "X" button
function createListItem(itemData) {
  const list = document.createElement("li");

  if (document.body.classList.contains("light_body")) {
    list.classList.add("light_input");
  }

  const paragraph = document.createElement("p");
  paragraph.classList.add("paragraph");

  paragraph.style.color = document.body.classList.contains("light_body")
    ? "hsl(235, 19%, 35%)"
    : "hsl(234, 39%, 85%)";

  const checkboxContainer = document.createElement("div");
  checkboxContainer.classList.add("checkbox-container");

  const completeItem = document.createElement("img");
  completeItem.src = "./images/icon-check.svg";
  completeItem.classList.add("check_box");

  checkboxContainer.appendChild(completeItem);
  const textNode = document.createTextNode(itemData.text);
  paragraph.appendChild(checkboxContainer);
  paragraph.appendChild(textNode);
  list.appendChild(paragraph);

  const deleteButton = document.createElement("img");
  deleteButton.src = "./images/icon-cross.svg";
  deleteButton.className = "delete-btn";
  list.appendChild(deleteButton);

  if (itemData.completed) {
    paragraph.classList.add("completed");
    paragraph.style.textDecoration = "line-through";
    paragraph.style.color = "hsl(234, 11%, 52%)";
    completeItem.classList.add("visible");
    checkboxContainer.classList.add("bg_checkBox");
  }

  // Modify the checkbox event listener within the createListItem function
  checkboxContainer.addEventListener("click", () => {
    const isChecked = paragraph.classList.contains("completed");
    if (isChecked) {
      paragraph.classList.remove("completed");
      paragraph.style.textDecoration = "none";
      paragraph.style.color = document.body.classList.contains("light_body")
        ? "hsl(235, 19%, 35%)"
        : "hsl(234, 39%, 85%)";
      completeItem.classList.remove("visible");
      checkboxContainer.classList.remove("bg_checkBox");
    } else {
      paragraph.classList.add("completed");
      paragraph.style.textDecoration = "line-through";
      paragraph.style.color = "hsl(234, 11%, 52%)";
      completeItem.classList.add("visible");
      checkboxContainer.classList.add("bg_checkBox");
    }

    saveToLocalStorage(); // Save the updated status
    updateItemCount(); // Update the item count

    // Automatically update the view based on the selected filter button
    const selectedButton = document.querySelector(".footer_btn.selected");
    if (selectedButton.id === "allBtn") {
      showAllItems(); // Show all items if 'All' is selected
    } else if (selectedButton.id === "activeBtn") {
      showActiveItems(); // Show active items if 'Active' is selected
    } else if (selectedButton.id === "completeBtn") {
      showCompletedItems(); // Show completed items if 'Completed' is selected
    }
  });

  deleteButton.addEventListener("click", () => {
    list.remove();
    newItem = newItem.filter((i) => i !== list);
    saveToLocalStorage();
    updateItemCount();
  });

  return list;
}

// Function to save the list items to local storage
function saveToLocalStorage() {
  const itemData = newItem.map((item) => {
    const paragraph = item.querySelector("p");
    return {
      text: paragraph.textContent.trim(),
      completed: paragraph.classList.contains("completed"),
      color: paragraph.style.color,
    };
  });
  localStorage.setItem("todoList", JSON.stringify(itemData));

  const themeMode = document.body.classList.contains("light_body")
    ? "light"
    : "dark";
  localStorage.setItem("themeMode", themeMode);

  const footerColor =
    document.getElementById("footerDisplay").style.backgroundColor;
  localStorage.setItem("footerColor", footerColor);
}

// Function to apply light mode
function applyLightMode() {
  document.body.classList.add("light_body");
  createToDo.classList.add("light_input");

  document.getElementById("sourceMobileDark").srcset =
    "./images/bg-mobile-light.jpg";
  document.getElementById("sourceDesktopDark").srcset =
    "./images/bg-desktop-light.jpg";
  document.getElementById("sourceImg").srcset = "./images/bg-desktop-light.jpg";

  displayList.querySelectorAll("li").forEach((item) => {
    item.classList.add("light_input");
    const paragraph = item.querySelector("p");
    paragraph.style.color = "hsl(235, 19%, 35%)";
  });

  document.getElementById("footerDisplay").style.backgroundColor =
    "hsl(236, 33%, 92%)";
}

// Function to apply dark mode
function applyDarkMode() {
  document.body.classList.remove("light_body");
  createToDo.classList.remove("light_input");

  document.getElementById("sourceMobileDark").srcset =
    "./images/bg-mobile-dark.jpg";
  document.getElementById("sourceDesktopDark").srcset =
    "./images/bg-desktop-dark.jpg";
  document.getElementById("sourceImg").srcset = "./images/bg-desktop-dark.jpg";

  displayList.querySelectorAll("li").forEach((item) => {
    item.classList.remove("light_input");
    const paragraph = item.querySelector("p");
    paragraph.style.color = "hsl(234, 39%, 85%)";
  });

  document.getElementById("footerDisplay").style.backgroundColor =
    "hsl(235, 24%, 19%)";
}

// Function to clear all completed items
function clearCompletedItems() {
  newItem = newItem.filter((item) => {
    const isCompleted = item.querySelector("p").classList.contains("completed");
    if (isCompleted) {
      item.remove(); // Remove from DOM
    }
    return !isCompleted; // Keep only items that are not completed
  });

  saveToLocalStorage();
  updateItemCount();
}

// Add event listener to the "Clear Completed" button
document
  .getElementById("clearBtn")
  .addEventListener("click", clearCompletedItems);

// Function to show all items
function showAllItems() {
  newItem.forEach((item) => {
    item.style.display = "flex";
  });

  updateButtonStyles("allBtn");
  updateItemCountDisplay(newItem.length);
}

// Function to show only active (unchecked) items
function showActiveItems() {
  let activeCount = 0;

  newItem.forEach((item) => {
    const isActive = !item.querySelector("p").classList.contains("completed");
    item.style.display = isActive ? "flex" : "none";
    if (isActive) activeCount++;
  });

  updateButtonStyles("activeBtn");
  updateItemCountDisplay(activeCount);
}

// Function to show only completed (checked) items
function showCompletedItems() {
  let completedCount = 0;

  newItem.forEach((item) => {
    const isCompleted = item.querySelector("p").classList.contains("completed");
    item.style.display = isCompleted ? "flex" : "none";
    if (isCompleted) completedCount++;
  });

  updateButtonStyles("completeBtn");
  updateItemCountDisplay(completedCount);
}

// Function to update the displayed item count
function updateItemCountDisplay(count) {
  const itemsCountElement = document.getElementById("itemsCount");
  itemsCountElement.textContent = count;
}

// Function to update button styles based on the selected filter
function updateButtonStyles(selectedButtonId) {
  const buttons = document.querySelectorAll(".footer_btn");
  buttons.forEach((button) => {
    button.id === selectedButtonId
      ? button.classList.add("selected")
      : button.classList.remove("selected");
  });
}

// Event listeners for the filter buttons
document.getElementById("allBtn").addEventListener("click", showAllItems);
document.getElementById("activeBtn").addEventListener("click", showActiveItems);
document
  .getElementById("completeBtn")
  .addEventListener("click", showCompletedItems);
