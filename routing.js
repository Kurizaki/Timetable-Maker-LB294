// Define routes for different sections of the application
const routes = {
  createtimetable: {
    hash: "#createtimetable",
    divId: "createtimetable",
    script: "createtimetable.js",
    func: () => {
      console.log("Create TimeTable route activated");
      // Hide the "showtimetable" div if it exists
      const showTimetableDiv = document.getElementById("showtimetable");
      if (showTimetableDiv) {
        showTimetableDiv.style.display = 'none';
      }

      // Show the "createtimetable" div
      const createTimetableDiv = document.getElementById("createtimetable");
      if (createTimetableDiv) {
        createTimetableDiv.style.display = 'block';
      }
    }
  },
  showtimetable: {
    hash: "#showtimetable",
    divId: "showtimetable",
    script: "showtimetable.js",
    func: () => {
      console.log("Show TimeTables route activated");
      // Show the "createtimetable" div
      const createTimetableDiv = document.getElementById("createtimetable");
      if (createTimetableDiv) {
        createTimetableDiv.style.display = 'block';
      }

      // Show the "showtimetable" div and trigger the showTimetables function
      const showTimetableDiv = document.getElementById("showtimetable");
      if (showTimetableDiv) {
        showTimetableDiv.style.display = 'block';
        showTimetables();
      }
    }
  },
};

// Router class for handling navigation and loading scripts
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.urlResolve();
    window.addEventListener("hashchange", () => {
      console.log("Hash changed. Resolving URL.");
      this.urlResolve();
    });
  }

  // Navigate to a specific hash
  navigate(hash) {
    let route = this.getRouteByHash(hash);
    if (route) {
      // Hide all divs associated with routes
      for (let key in this.routes) {
        const targetDiv = document.getElementById(this.routes[key].divId);
        if (targetDiv) {
          targetDiv.style.display = 'none';
        }
      }

      // Show the target div and load the script
      const targetDiv = document.getElementById(route.divId);
      if (targetDiv) {
        targetDiv.style.display = 'block';
      }

      this.loadScript(route);

      // Execute the route-specific function
      route.func();
    }
  }

  // Load a script dynamically
  loadScript(route) {
    const scriptFilename = route.script;
    const scriptElement = document.createElement("script");
    scriptElement.src = scriptFilename;

    // Append the script to the head if it doesn't already exist
    if (!document.querySelector(`script[src="${scriptFilename}"]`)) {
      document.head.appendChild(scriptElement);
    }
  }

  // Get route information based on the hash
  getRouteByHash(hash) {
    for (let key in this.routes) {
      if (this.routes[key].hash === hash) {
        return this.routes[key];
      }
    }
    return null;
  }

  // Resolve the URL when the page loads
  urlResolve() {
    this.navigate(location.hash);
  }
}

// Create an instance of the Router with the defined routes
const router = new Router(routes);
router.navigate(location.hash);
