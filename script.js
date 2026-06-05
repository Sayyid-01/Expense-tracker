const form = document.querySelector("#expense-form");
const amount = document.querySelector("#amount");
const description = document.querySelector("#description");
const category = document.querySelector("#category");
const expenseList = document.querySelector("#expense-list");

let editIndex = null;

// Display expenses
function displayExpenses() {
    expenseList.innerHTML = "";

    const expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    expenses.forEach((expense, index) => {
        const li = document.createElement("li");

        li.textContent =
            `Amount: ${expense.amount}, Description: ${expense.description}, Category: ${expense.category}`;

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            expenses.splice(index, 1);

            localStorage.setItem(
                "expenses",
                JSON.stringify(expenses)
            );

            displayExpenses();
        });

        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", () => {
            amount.value = expense.amount;
            description.value = expense.description;
            category.value = expense.category;

            editIndex = index;
        });

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        expenseList.appendChild(li);
    });
}

// Add / Update Expense
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const expense = {
        amount: amount.value,
        description: description.value,
        category: category.value,
    };

    let expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    if (editIndex !== null) {
        // Update existing expense
        expenses[editIndex] = expense;
        editIndex = null;
    } else {
        // Add new expense
        expenses.push(expense);
    }

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    form.reset();

    displayExpenses();
});

// Load expenses when page opens
displayExpenses();