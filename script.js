// DOM Elements
const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const searchBar = document.getElementById("searchBar");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1; // To track which student is being edited

// Function to render students
function renderStudents(filter = "") {
  studentList.innerHTML = "";
  students
    .filter(student => student.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((student, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Name">${student.name}</td>
        <td data-label="ID">${student.studentId}</td>
        <td data-label="Email">${student.email}</td>
        <td data-label="Contact">${student.contact}</td>
        <td class="actions">
          <!-- Edit button -->
          <button class="edit" onclick="editStudent(${index})">
            <i class="fas fa-edit"></i>
          </button>
          <!-- Delete button -->
          <button class="delete" onclick="deleteStudent(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      studentList.appendChild(row);
    });
}

// Handle Add / Update Student
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();

  // ✅ Validation
  if (!name.match(/^[A-Za-z\s]+$/)) {
    alert("Name must contain only letters!");
    return;
  }
  if (!studentId.match(/^[0-9]+$/)) {
    alert("Student ID must be numbers only!");
    return;
  }
  if (!email.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
    alert("Invalid Email format!");
    return;
  }
  if (!contact.match(/^[0-9]{10,}$/)) {
    alert("Contact must be at least 10 digits!");
    return;
  }

  const student = { name, studentId, email, contact };

  if (editIndex === -1) {
    // ➕ Add new student
    students.push(student);
  } else {
    // ✏️ Update existing student
    students[editIndex] = student;
    editIndex = -1; // Reset edit mode
  }

  // Save to Local Storage
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
  form.reset();
});

// Function to edit student
function editStudent(index) {
  const student = students[index];

  document.getElementById("name").value = student.name;
  document.getElementById("studentId").value = student.studentId;
  document.getElementById("email").value = student.email;
  document.getElementById("contact").value = student.contact;

  editIndex = index; // Remember which student is being edited
}

// Function to delete student
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    students.splice(index, 1); // Remove student
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
  }
}

// 🔍 Search functionality
searchBar.addEventListener("input", (e) => {
  renderStudents(e.target.value);
});

// Initial render on page load
renderStudents();
