const Modal = {
    open(){
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close(){
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/02/2021'
    },
    {
        id: 2,
        description: 'Website',
        amount: 500000,
        date: '23/02/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/02/2021'
    },
    {
        id: 4,
        description: 'Vendi um treco',
        amount: 400000,
        date: '23/02/2021'
    },
]

const Transaction = {
    incomes() {
        return 'soma as entradas'
    },
    expanses() {
        return 'soma as saidas'
    },
    total() {
        return 'entradas - saidas'
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, ndex) {
        //console.log(transaction)
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {
        const CssClass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CssClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="/assets/minus.svg" alt="Remover transação" class="minus"></td>
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Transaction.incomes()
        document
            .getElementById('expenseDisplay')
            .innerHTML = Transaction.expanses()
        document
            .getElementById('totalDisplay')
            .innerHTML = Transaction.total()
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''
        value = String(value).replace(/\D/g,'')     // pega todos os não numeros da string e substitui por vazio
        value = Number(value) / 100
        value = value.toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
        })
        const currency = signal + value
        return currency
    }
}

transactions.forEach(function(transaction){
    DOM.addTransaction(transaction)
})

DOM.updateBalance()
