let nodes = [];
let edges = [];
let network;
let employeeMap = {};
let uploadedFile = null;

const backendURL = "http://localhost:3000";

window.onload = function () {
  fetch(`${backendURL}/data`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert("No data found. Please upload an Excel file.");
      } else {
        buildHierarchy(data);
        drawTree();
      }
    })
    .catch((err) => {
      console.error(err);
      alert("❌ Could not load data from backend.");
    });
};

document.getElementById("searchBox").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchNode();
  }
});


document.getElementById('upload').addEventListener('change', function (e) {
  uploadedFile = e.target.files[0];
  const formData = new FormData();
  formData.append("file", uploadedFile);

  fetch(`${backendURL}/upload`, {
    method: "POST",
    body: formData
  })
    .then((res) => res.json())
    .then(() => {
      alert("✅ Excel uploaded successfully!");
      location.reload();
    })
    .catch(() => alert("❌ Upload failed. Check server connection."));
});

function buildHierarchy(json) {
  nodes = [];
  edges = [];
  employeeMap = {};

  json.forEach(emp => {
    const id = emp.staff_no?.toString().trim();
    if (id) {
      employeeMap[id] = emp;
      nodes.push({
        id,
        label: `${emp.employee_name}\n(${emp.designation})`,
        shape: "box",
        color: "#AED6F1",
        font: {
          size: 20,
          bold: true
        },
        widthConstraint: {
          minimum: 160,
          maximum: 260
        },
        heightConstraint: {
          minimum: 70
        }
      });
    }
  });

  json.forEach(emp => {
    const childId = emp.staff_no?.toString().trim();
    const parentId = emp.parent?.toString().trim();
    if (childId && parentId && employeeMap[parentId]) {
      edges.push({ from: parentId, to: childId });
    }
  });
}

function drawTree() {
  const container = document.getElementById("network");
  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };

  const options = {
    layout: {
      hierarchical: {
        direction: "UD",
        sortMethod: "directed",
        nodeSpacing: 200,
        levelSeparation: 180,
        treeSpacing: 300
      }
    },
    nodes: {
      margin: 12,
      shape: "box",
      font: {
        size: 20,
        bold: true
      },
      widthConstraint: {
        minimum: 160,
        maximum: 260
      },
      heightConstraint: {
        minimum: 70
      },
      color: {
        background: "#AED6F1",
        border: "#2C3E50"
      }
    },
    edges: {
      smooth: {
        type: "cubicBezier",
        forceDirection: "vertical",
        roundness: 0.4
      },
      arrows: {
        to: { enabled: false }
      },
      color: "#555"
    },
    interaction: {
      hover: true,
      zoomView: false,   // 🔒 Disable zoom on scroll
      dragView: true     // ✅ Allow panning with mouse drag
    },
    physics: false
  };

  network = new vis.Network(container, data, options);

  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const emp = employeeMap[nodeId];

      const roleMap = {
        "1": "Team Member",
        "2": "Lead",
        "3": "Project Manager"
      };

      const getProjectRole = (pKey, rKey) => {
        const project = String(emp[pKey] ?? "").trim();
        const role = String(emp[rKey] ?? "").trim();
        if (project && roleMap[role]) {
          return `✔️ ${roleMap[role]}`;
        }
        return "—";
      };

      showPopup(emp, getProjectRole);
    }
  });
}

function showPopup(emp, getRoleFn) {
  document.getElementById("popup").style.display = "block";
  document.getElementById("popupDetails").innerHTML = `
    <h3>${emp.employee_name}</h3>
    <p><strong>Staff No:</strong> ${emp.staff_no}</p>
    <p><strong>Designation:</strong> ${emp.designation}</p>
    <p><strong>Reports To:</strong> ${emp.parent || "None"}</p>
    <p><strong>S No. :</strong> ${emp.s_no || "-"}</p>
    <hr>
    <p><strong>Project-1:</strong> ${getRoleFn("project1", "role1")}</p>
    <p><strong>Project-2:</strong> ${getRoleFn("project2", "role2")}</p>
    <p><strong>Project-3:</strong> ${getRoleFn("project3", "role3")}</p>
    <hr>
    <p><strong>Joining Date:</strong> ${emp.joining_date || "N/A"}</p>
    <p><strong>Department:</strong> ${emp.department || "N/A"}</p>
    <p><strong>Email:</strong> ${emp.email || "N/A"}</p>
    <p><strong>Phone:</strong> ${emp.phone || "N/A"}</p>
  `;
}

document.getElementById("close").addEventListener("click", function () {
  document.getElementById("popup").style.display = "none";
});

function searchNode() {
  const val = document.getElementById("searchBox").value.toLowerCase().trim();
  if (!val) return;
  const found = nodes.find(
    n =>
      n.label.toLowerCase().includes(val) ||
      n.id.toLowerCase().includes(val)
  );
  if (found) {
    network.selectNodes([found.id]);
    network.focus(found.id, {
      scale: 1.5,
      animation: true
    });
  } else {
    alert("Employee not found.");
  }
}

function resetView() {
  network.fit({ animation: true });
}

function zoomIn() {
  let scale = network.getScale();
  network.moveTo({ scale: scale + 0.2 });
}

function zoomOut() {
  let scale = network.getScale();
  network.moveTo({ scale: scale - 0.2 });
}

function toggleFullScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function downloadExcel() {
  if (!uploadedFile) return;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(uploadedFile);
  link.download = uploadedFile.name;
  link.click();
}
