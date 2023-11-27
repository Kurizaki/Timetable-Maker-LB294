// app.js
let schedule = [];

function addRow() {
  const newRow = Array(schedule[0].length).fill('');
  schedule.push(newRow);
  renderSchedule();
}

function addColumn() {
  schedule.forEach(row => row.push(''));
  renderSchedule();
}

function renderSchedule() {
  const scheduleContainer = document.getElementById('schedule');
  scheduleContainer.innerHTML = '';

  const table = document.createElement('table');

  schedule.forEach(rowData => {
    const row = document.createElement('tr');

    rowData.forEach(cellData => {
      const cell = document.createElement('td');
      cell.textContent = cellData;
      row.appendChild(cell);
    });

    table.appendChild(row);
  });

  scheduleContainer.appendChild(table);
}

function getSchedule() {
  const scheduleId = document.getElementById('scheduleId').value;
  // Hier sollte die Backend-API aufgerufen werden, um den Stundenplan mit der ID abzurufen
  // Beispiel: fetch(`/api/schedule/${scheduleId}`)
  //         .then(response => response.json())
  //         .then(data => {
  //           schedule = data;
  //           renderSchedule();
  //         });
}

