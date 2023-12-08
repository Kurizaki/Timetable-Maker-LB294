console.log("showTimeTables.js loaded");

// API URL for fetching and deleting timetables
const apiUrl = 'http://localhost:2940/api/v1/entities';

// Reference to the div where timetables will be displayed
const showTimetablesDiv = document.getElementById('showtimetable');

// Function to fetch timetables from the server
async function fetchTimetables() {
  console.log("Fetching Timetables");

  try {
    const response = await fetch(apiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    
    if (!response.ok) throw new Error('Failed to fetch timetables');

    const timetables = await response.json();
    console.log('Fetched Timetables:', timetables);
    return timetables;
  } catch (error) {
    console.error('Error fetching timetables:', error.message);
    return null;
  }
}

// Function to create a button element with specified text and onClick function
function createButton(text, onClick) {
  const button = document.createElement('button');
  button.innerText = text;
  button.onclick = onClick;
  return button;
}

// Function to delete a timetable by its ID
async function deleteTimetable(timetableId) {
  try {
    const response = await fetch(`${apiUrl}/${timetableId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
    
    if (!response.ok) throw new Error('Failed to delete timetable');

    // Reload timetables after deletion
    showTimetables();
  } catch (error) {
    console.error('Error deleting timetable:', error.message);
  }
}

// Function to reload timetables
function reloadTimetables() {
  showTimetables();
}

// Function to display timetables in the designated div
async function showTimetables() {
  showTimetablesDiv.innerHTML = '';

  // Create a title for the section
  const title = document.createElement('h2');
  title.innerText = 'Show TimeTables';
  showTimetablesDiv.appendChild(title);

  // Create a button to reload timetables
  const reloadButton = createButton('Reload Timetables', reloadTimetables);
  title.insertAdjacentElement('afterend', reloadButton);

  try {
    // Fetch timetables from the server
    const timetables = await fetchTimetables();
    const contentDiv = document.createElement('div');

    // Check if timetables are available
    if (!timetables || timetables.length === 0) {
      contentDiv.innerHTML = '<p>No timetables found.</p>';
    } else {
      // Iterate through each timetable and create buttons for editing and deleting
      timetables.forEach((timetable) => {
        const editButton = createButton('Edit', () => editTimetable(timetable.id));
        const deleteButton = createButton('Delete', () => deleteTimetable(timetable.id));

        // Create a div to display timetable information and append buttons
        const timetableDiv = document.createElement('div');
        timetableDiv.innerHTML = `<h3>${timetable.timetable.name}</h3>`; // Assuming `timetable.name` is the property holding the timetable name
        timetableDiv.append(editButton, deleteButton);
        contentDiv.appendChild(timetableDiv);
      });
    }

    // Append the content to the showTimetablesDiv
    showTimetablesDiv.appendChild(contentDiv);
  } catch (error) {
    console.error('Error fetching timetables:', error.message);
    // Display an error message if there is an issue fetching timetables
    showTimetablesDiv.innerHTML += '<p>Error fetching timetables</p>';
  }
}

// Import the editTimetable function from the editTimeTable module
import { editTimetable } from './editTimeTable.js';

// Event listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOMContentLoaded event fired");
  showTimetables(); // Display timetables when the page loads
});
