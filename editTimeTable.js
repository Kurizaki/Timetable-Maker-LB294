console.log("editTimetable.js loaded");

const apiUrl = 'http://localhost:2940/api/v1/entities';
const appElement = document.getElementById('createtimetable');
let id;

async function editTimetable(timetableId) {
  try {
    console.log('Fetching timetable for editing:', timetableId);
    const response = await fetch(`${apiUrl}/${timetableId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch timetable for editing');
    }
    id = timetableId;
    const timetableData = await response.json();
    console.log('Fetched Timetable for Editing:', timetableData);
    renderEditTimetable(timetableData.timetable);
  } catch (error) {
    console.error('Error editing timetable:', error.message);
  }
}

function renderEditTimetable(timetableData) {
  appElement.innerHTML = '';
  const editTable = createElem('table', appElement);
  const [thead, tbody] = ['thead', 'tbody'].map((type) => createElem(type, editTable));

  function addHeaderCell(text, isEditable = false) {
    const th = createElem('th', thead);
    const input = createElem('input', th, { placeholder: text, readOnly: !isEditable });

    if (isEditable) {
      input.value = text;
      input.addEventListener('input', (event) => {
        timetableData.entries[0].activities[th.cellIndex - 1][`day${th.cellIndex}`] = event.target.value;
      });
    } else {
      th.textContent = text;
    }
  }

  function addCell(row, placeholder, isTime = false, isEditable = false, value) {
    const td = createElem('td', row);
    const input = createElem('input', td, { placeholder, readOnly: !isEditable });

    if (isTime || isEditable) {
      input.value = value;
      input.addEventListener('input', (event) => {
        const rowIndex = row.rowIndex - 1;
        const cellIndex = td.cellIndex - 1;

        if (isTime) {
          timetableData.entries[rowIndex].startTime = event.target.value;
        } else {
          timetableData.entries[rowIndex].activities[cellIndex][`day${cellIndex + 1}`] = event.target.value;
        }
      });
    }
  }

  const tr = createElem('tr', tbody);
  addHeaderCell('Time', true);
  timetableData.entries[0].activities.forEach((activity, index) => addHeaderCell(`Day ${index + 1}`, true));

  timetableData.entries.forEach((row) => {
    const tr = createElem('tr', tbody);
    addCell(tr, 'Time', true, true, row.startTime);
    row.activities.forEach((activity, index) => addCell(tr, 'Activity', false, true, activity[`day${index + 1}`]));
  });

  console.log('timetableData:', timetableData);

  const saveChangesButton = createButton('Save Changes', () => {
    console.log('Saving changes button clicked');
    console.log('id:', id);
    console.log('timetableData.name:', timetableData.name);
    console.log('timetableData.entries:', timetableData.entries);

    saveChanges(id, timetableData.name, timetableData.entries);
  });

  const backButton = createButton('Back', () => loadCreateTimetableScript());

  appElement.appendChild(saveChangesButton);
  appElement.appendChild(backButton);
}

async function saveChanges(timetableId, timetableName, entries) {
  try {
    console.log('Saving changes for timetable:', timetableId);
    const response = await fetch(`${apiUrl}/${timetableId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: timetableName,
        entries: entries.map(({ startTime, activities }) => ({
          startTime,
          activities: activities.map(({ day, activity }) => ({ day, activity })),
        })),
      }),
    });

    console.log('Response:', response);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to save changes to the timetable. Server response: ${errorMessage}`);
    }

    alert('Changes saved successfully!');
    loadCreateTimetableScript();
  } catch (error) {
    console.error('Error saving changes to the timetable:', error.message);
  }
}

function loadCreateTimetableScript() {
  const script = document.createElement('script');
  script.src = 'createTimeTable.js';
  document.body.appendChild(script);
}

function createButton(text, onClick) {
  const button = createElem('button', appElement, { textContent: text, className: text.toLowerCase().replace(" ", "") });
  button.addEventListener("click", onClick);
  return button;
}

function createElem(type, parent, attributes = {}) {
  const elem = Object.assign(document.createElement(type), attributes);
  parent.appendChild(elem);
  return elem;
}

export { editTimetable };
