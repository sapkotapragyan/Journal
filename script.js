// JavaScript code to handle journal, ledger, and trial balance logic
document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Input fields
    const date = document.getElementById("date").value;
    const transaction = document.getElementById("transaction").value;

    // Validate inputs
    if (!date || !transaction) {
        alert("Please fill out all fields.");
        return;
    }

    // Process transaction
    const [debitAccount, creditAccount, amount] = parseTransaction(transaction);

    if (!debitAccount || !creditAccount || isNaN(amount)) {
        alert("Invalid transaction format. Example: Business started with cash $1000");
        return;
    }

    // Add to Journal
    addJournalEntry(date, debitAccount, creditAccount, amount);

    // Update Ledger
    updateLedger(debitAccount, amount, "debit");
    updateLedger(creditAccount, amount, "credit");

    // Update Trial Balance
    updateTrialBalance(debitAccount, amount, "debit");
    updateTrialBalance(creditAccount, amount, "credit");

    // Clear form
    document.getElementById("transaction-form").reset();
});

// Parse transaction to extract debit account, credit account, and amount
function parseTransaction(transaction) {
    const regex = /(.+) with (.+) \$(\d+)/i;
    const match = transaction.match(regex);
    if (match) {
        const debitAccount = match[2].toLowerCase().includes("cash") ? "Cash" : match[2];
        const creditAccount = match[1];
        const amount = parseFloat(match[3]);
        return [debitAccount, creditAccount, amount];
    }
    return [null, null, null];
}

// Add entry to the journal table
function addJournalEntry(date, debit, credit, amount) {
    const journalTable = document.getElementById("journal-table").querySelector("tbody");
    journalTable.innerHTML += `
        <tr>
            <td>${date}</td>
            <td>${debit}</td>
            <td>${amount.toFixed(2)}</td>
            <td></td>
        </tr>
        <tr>
            <td>${date}</td>
            <td>${credit}</td>
            <td></td>
            <td>${amount.toFixed(2)}</td>
        </tr>`;
}

// Update ledger entries
function updateLedger(account, amount, type) {
    let ledger = document.querySelector(`#ledger-entries [data-account='${account}']`);

    if (!ledger) {
        const ledgerContainer = document.getElementById("ledger-entries");
        ledger = document.createElement("div");
        ledger.className = "ledger-account";
        ledger.setAttribute("data-account", account);
        ledger.innerHTML = `
            <h3>${account}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Debit</th>
                        <th>Credit</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`;
        ledgerContainer.appendChild(ledger);
    }

    const ledgerBody = ledger.querySelector("tbody");
    ledgerBody.innerHTML += `
        <tr>
            <td>${new Date().toISOString().split("T")[0]}</td>
            <td>${type === "debit" ? amount.toFixed(2) : ""}</td>
            <td>${type === "credit" ? amount.toFixed(2) : ""}</td>
        </tr>`;
}

// Update trial balance
function updateTrialBalance(account, amount, type) {
    const trialBalanceTable = document.getElementById("trial-balance-table").querySelector("tbody");
    let row = trialBalanceTable.querySelector(`[data-account='${account}']`);

    if (!row) {
        row = document.createElement("tr");
        row.setAttribute("data-account", account);
        row.innerHTML = `
            <td>${account}</td>
            <td>0.00</td>
            <td>0.00</td>`;
        trialBalanceTable.appendChild(row);
    }

    const debitCell = row.children[1];
    const creditCell = row.children[2];

    if (type === "debit") {
        debitCell.textContent = (parseFloat(debitCell.textContent) + amount).toFixed(2);
    } else {
        creditCell.textContent = (parseFloat(creditCell.textContent) + amount).toFixed(2);
    }
}
