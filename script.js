// Declare global variables
let selectedView = "Bullish";
let selectedDate = "24-Apr-2024"; // Ensure correct format for matching strategy data

window.addEventListener("load", () => {
  const tabButtons = document.querySelectorAll(".tab");
  const dropdown = document.querySelector(".dropdown");
  const dropdownButton = document.querySelector(".dropdown-button");
  const dropdownList = document.querySelector(".dropdown-list");
  const strategyContainer = document.querySelector(".strategies");

  console.log("Dropdown button:", dropdownButton);

  if (!dropdownButton) {
    console.error("Dropdown button not found!");
    return;
  }

  function setDefaultDate() {
    dropdownButton.textContent = selectedDate;
    const defaultItem = [...dropdownList.querySelectorAll("li")].find(
      (item) => item.textContent.trim() === selectedDate
    );
    if (defaultItem) {
      defaultItem.classList.add("selected");
    }
  }

  dropdownButton.addEventListener("click", () => {
    dropdown.classList.toggle("open");
    console.log("Dropdown toggled:", dropdown.classList.contains("open"));
  });

  dropdownList.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      dropdownList.querySelector(".selected")?.classList.remove("selected");
      event.target.classList.add("selected");
      selectedDate = event.target.textContent.trim();
      dropdownButton.textContent = selectedDate;
      dropdown.classList.remove("open");
      strategyContainer.style.marginTop = "0";
      renderStrategies();
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      strategyContainer.style.marginTop = "0";
    }
  });

  function renderStrategies() {
    strategyContainer.innerHTML = "";
    console.log("Rendering strategies for:", selectedView, selectedDate);

    if (!strategyArray || strategyArray.length === 0) {
      console.error("strategyArray is empty or undefined!");
      return;
    }

    // ✅ Collect only dates that contain strategies
    const validDates = [...new Set(strategyArray.flatMap(view => 
      Object.entries(view.Value).filter(([_, strategies]) => strategies.length > 0).map(([date]) => date)
    ))];

    console.log("Valid strategy dates:", validDates);

    // ✅ Ensure dropdown only lists valid strategy dates
    dropdownList.innerHTML = validDates.map(date => `<li>${date}</li>`).join("");

    if (!validDates.includes(selectedDate)) {
      console.error(`No strategies exist for '${selectedDate}'. Showing empty state.`);
      strategyContainer.innerHTML = `<div class="empty-state">No strategies for ${selectedDate}</div>`;
      return;
    }

    const currentView = strategyArray.find(item => item.View.trim().toLowerCase() === selectedView.trim().toLowerCase());

    if (!currentView) {
      console.error("No matching strategy view found for:", selectedView);
      strategyContainer.innerHTML = `<div class="empty-state">No strategies found for ${selectedView}</div>`;
      return;
    }

    const strategies = currentView?.Value[selectedDate] || [];
    console.log("Retrieved strategies for selected date:", strategies);

    if (strategies.length === 0) {
      console.log("No strategies found for date:", selectedDate);
      strategyContainer.innerHTML = `<div class="empty-state">No strategies for ${selectedDate}</div>`;
      return;
    }

    // Correctly count identical strategy occurrences
    const strategyCountMap = strategies.reduce((acc, strategy) => {
      acc[strategy] = (acc[strategy] || 0) + 1;
      return acc;
    }, {});

    console.log("Strategy count map:", strategyCountMap);

    Object.entries(strategyCountMap).forEach(([name, count]) => {
      const card = document.createElement("div");
      card.className = "strategy-card";

      const nameElem = document.createElement("div");
      nameElem.className = "strategy-name";
      nameElem.textContent = name;

      const countElem = document.createElement("div");
      countElem.className = "strategy-count";
      countElem.textContent = `${count} ${count > 1 ? "Strategies" : "Strategy"}`;

      card.appendChild(nameElem);
      card.appendChild(countElem);
      strategyContainer.appendChild(card);
    });

    console.log("Strategy cards updated successfully.");
  }

  // Tab Switching Logic
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      selectedView = button.getAttribute("data-view");

      renderStrategies();
      strategyContainer.style.marginTop = dropdown.classList.contains("open") ? "50px" : "0";
    });
  });

  setDefaultDate();
  renderStrategies();
});