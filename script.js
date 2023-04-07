(async function () {
  const data = await fetch("data.json");
  const res = await data.json();

  let employees = res;
  let selectedEmployeeId = employees[0]?.id ?? -1;
  let selectedEmployee = employees[0] ?? {};

  const employeeList = document.querySelector(".employees__names--list");
  const employeeInfo = document.querySelector(".employees__single--info");

  // Add Employee - START
  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");

  createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });

  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      addEmployeeModal.style.display = "none";
    }
  });

  // Set DOB input max date (minimum 18 years old)
  const dobInput = document.querySelector(".addEmployee_create--dob");
  const now = new Date();
  const year = now.getFullYear() - 18;
  const monthDay = now.toISOString().slice(5, 10);
  dobInput.max = `${year}-${monthDay}`;

  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    const values = [...formData.entries()];
    let empData = {};
    values.forEach(([key, value]) => {
      empData[key] = value;
    });

    empData.id = employees.length
      ? employees[employees.length - 1].id + 1
      : 1001;
    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl = empData.imageUrl || "gfg.png";
    employees.push(empData);

    renderEmployees();
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
  });
  // Add Employee - END

  // Select or Delete Employee - START
  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = parseInt(e.target.id, 10);
      renderEmployees();
      renderSingleEmployee();
    }

    if (e.target.tagName === "I") {
      const idToDelete = parseInt(e.target.parentNode.id, 10);
      employees = employees.filter((emp) => emp.id !== idToDelete);

      if (selectedEmployeeId === idToDelete) {
        selectedEmployeeId = employees[0]?.id ?? -1;
        selectedEmployee = employees[0] ?? {};
      }
      renderEmployees();
      renderSingleEmployee();
    }
  });
  // Select or Delete Employee - END

  // Render Employee List - START
  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp) => {
      const employee = document.createElement("span");
      employee.classList.add("employees__names--item");
      if (selectedEmployeeId === emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }
      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} ${emp.lastName} 
        <i class="employeeDelete">&#10060;</i>`;
      employeeList.append(employee);
    });
  };
  // Render Employee List - END

  // Render Selected Employee Info - START
  const renderSingleEmployee = () => {
    if (selectedEmployeeId === -1 || !selectedEmployee) {
      employeeInfo.innerHTML = "";
      return;
    }

    employeeInfo.innerHTML = `
      <img src="${selectedEmployee.imageUrl}" alt="Employee Image"/>
      <span class="employees__single--heading">
        ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
      </span>
      <span>${selectedEmployee.address}</span>
      <span>${selectedEmployee.email}</span>
      <span>Mobile - ${selectedEmployee.contactNumber}</span>
      <span>DOB - ${selectedEmployee.dob}</span>
    `;
  };
  // Render Selected Employee Info - END

  // Initial Render
  renderEmployees();
  if (selectedEmployeeId !== -1) renderSingleEmployee();
})();
