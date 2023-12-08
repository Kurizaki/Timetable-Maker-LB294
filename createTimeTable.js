// Check if the script has already run
if (!window.createTimeTableScriptLoaded) {
  window.createTimeTableScriptLoaded = true;

  console.log("createTimeTable.js loaded");

  // Constants
  const apiUrl = 'http://localhost:2940/api/v1/entities';
  const appElement = document.getElementById('createtimetable');
  let timetable = initializeTimetable();

  // Initialize timetable with default values
  function initializeTimetable() {
    return Array.from({ length: 5 }, () => ({ startTime: '', activities: Array(5).fill({}) }));
  }

  // Create and append an element to the parent with optional attributes
  function createElem(type, parent, attributes = {}) {
    const elem = Object.assign(document.createElement(type), attributes);
    parent.appendChild(elem);
    return elem;
  }

  // Remove element if it exists
  function removeElementIfExists(element) {
    const existingElement = document.querySelector(element);
    if (existingElement) appElement.removeChild(existingElement);
  }

  // Render timetable based on the current state
  function renderTimetable() {
    removeElementIfExists('table');

    const table = createElem('table', appElement);
    const [thead, tbody] = ['thead', 'tbody'].map((type) => createElem(type, table));

    // Function to add a cell to a row
    function addCell(row, text, isTime = false, isEditable = false) {
      const td = createElem('td', row);
      const content = createElem('input', td, { value: text, readOnly: !isEditable });

      if (isTime || isEditable) {
        content.addEventListener('input', (event) => {
          const rowIndex = parseInt(row.getAttribute('data-row-index'), 10) - 1;
          const cellIndex = td.cellIndex - 1;

          if (isTime) {
            timetable[rowIndex].startTime = event.target.value;
          } else {
            timetable[rowIndex].activities[cellIndex][`day${cellIndex + 1}`] = event.target.value;
          }
        });
      }
    }

    // Create header row
    const tr = createElem('tr', thead);
    addCell(tr, 'Time', true, false);
    timetable[0].activities.forEach((day, index) => addCell(tr, `Day ${index + 1}`, false, false));

    // Create data rows
    timetable.forEach((row, rowIndex) => {
      const tr = createElem('tr', tbody);
      tr.setAttribute('data-row-index', rowIndex + 1);
      addCell(tr, row.startTime, true, true);
      row.activities.forEach((activity, index) => addCell(tr, activity[`day${index + 1}`] || '', false, true));
    });
  }

  // Create a button with text and click event handler
  function createButton(text, onClick) {
    const button = createElem('button', appElement, { textContent: text, className: text.toLowerCase().replace(" ", "") });
    button.addEventListener("click", onClick);
  }

  // Adjust table size based on user input
  function adjustTable() {
    const columnSizeInput = document.getElementById('columnSize');
    const rowSizeInput = document.getElementById('rowSize');
    const newColumnSize = parseInt(columnSizeInput.value, 10);
    const newRowSize = parseInt(rowSizeInput.value, 10);

    if (!isNaN(newColumnSize) && newColumnSize > 0 && !isNaN(newRowSize) && newRowSize > 0) {
      // Update the existing timetable without redeclaring it
      timetable = Array.from({ length: newRowSize }, () => ({ startTime: '', activities: Array(newColumnSize).fill({}) }));

      // Update input values based on the adjusted timetable size
      columnSizeInput.value = newColumnSize;
      rowSizeInput.value = newRowSize;

      renderTimetable();
    } else {
      alert('Please enter valid column and row sizes.');
    }
  }

  // Save timetable data to the server
  async function saveData() {
    console.log("Saving Data");
    const timetableNameInput = document.getElementById('timetableName');
    const timetableName = timetableNameInput.value;

    if (!timetableName.trim()) {
      alert('Please insert a non-empty name before saving to the database.');
      timetableNameInput.focus();
      return;
    }

    // Serialize timetable data
    const serializedTimetable = {
      name: timetableName,
      entries: timetable.map((row, rowIndex) => ({
        startTime: row.startTime,
        activities: row.activities.map((activity, dayIndex) => ({
          [`day${dayIndex + 1}`]: activity[`day${dayIndex + 1}`] ? activity[`day${dayIndex + 1}`].trim() : '',
        })),
      })),
    };

    const data = { timetable: serializedTimetable };
    console.log(data);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save timetable');
      alert('Timetable saved successfully!');
    } catch (error) {
      console.error('Error saving timetable:', error.message);
    }
  }

  // Initialize the UI elements only if they haven't been created before
  createElem('h2', appElement, { textContent: 'Timetable Maker' });
  createElem('input', appElement, { id: 'timetableName', placeholder: 'Timetable Name' });
  createElem('label', appElement, { textContent: 'Column Size: ' });
  const columnSizeInput = createElem('input', appElement, { id: 'columnSize', type: 'number', value: timetable[0].activities.length });
  createElem('label', appElement, { textContent: 'Row Size: ' });
  const rowSizeInput = createElem('input', appElement, { id: 'rowSize', type: 'number', value: timetable.length });
  createButton('Adjust Table', adjustTable);

  // Render initial timetable
  renderTimetable();

  // Create save button
  createButton('Save', saveData);
}
