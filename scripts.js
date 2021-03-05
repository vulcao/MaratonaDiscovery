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

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions",
                            JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction){
        Transaction.all.push(transaction);

        App.reload()
    },
    remove(index){
        Transaction.all.splice(index,1);
        App.reload()
    },
    incomes() {
        //return 'soma as entradas'
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0){
                income += transaction.amount;
            }
        });
        return income;
    },
    expenses() {
        //return 'soma as saidas'
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0){
                expense += transaction.amount;
            }
        });
        return expense;
    },
    total() {
        //return 'entradas - saidas'
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction,index) {
        const CssClass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CssClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="/assets/minus.svg" alt="Remover transação" class="minus"></td>
        `
        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ''
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
    },
    formatAmount(value) {
        value = Number(value) * 100
        // value = Number(value.replace(/\,\./g, "") * 100)
        // as duas formas funcionam, deixei aqui só pelo regex
        return value
    },
    formatDate(value) {
        const aux = value.split("-")
        value = `${aux[2]}/${aux[1]}/${aux[1]}`
        return value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validadeFields(){
        const {description,amount,date} = Form.getValues()
        if(description.trim() === "" || 
           amount.trim() === "" ||
           date.trim() === "") {
               throw new Error("Preencha todos os campos")
           }
    },
    formatValues(){
        let {description,amount,date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },
    saveTransaction(transaction){
        Transaction.add(transaction)
    },
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event){
        event.preventDefault()
        try {
            Form.validadeFields()
            const transaction = Form.formatValues()
            Form.saveTransaction(transaction)   
            Form.clearFields() 
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
        
    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction,index) => {
            DOM.addTransaction(transaction,index)
        });
        DOM.updateBalance();

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init()


// Transaction.add({
//     description: 'Alo',
//     amount: 200,
//     date: '01/03/2021'
// })
// Transaction.remove(2)