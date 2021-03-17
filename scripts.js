TiposAtivo = [
    {
        Codigo: 1,
        Descricao: "Ação"
    },
    {
        Codigo: 2,
        Descricao: "FII"
    }
]
CategoriasAtivo = [
    {
        Codigo:1,
        Descricao:"LOGÍSTICA"
    },
    {
        Codigo:2,
        Descricao:"SHOPPING"
    },
    {
        Codigo:3,
        Descricao:"FUNDO DE FUNDOS"
    },
    {
        Codigo:4,
        Descricao:"LAJES COORPORATIVAS"
    },
    {
        Codigo:5,
        Descricao:"PAPEIS"
    },
]
Ativos = [
    {
        Codigo:"HFOF11",
        Tipo:2,
        Categoria: 1,
        PrecoMedio: 10248,
        PrecoAtual: 10086,
        Posicao: 2,
        DividendYeld: 789,
        Dividendo: 55,
        Atualizacao: "2021-03-16 10:30:00"
    },
    {
        Codigo:"MXRF11",
        Tipo:2,
        Categoria: 5,
        PrecoMedio: 1055,
        PrecoAtual: 1063,
        Posicao: 7,
        DividendYeld: 800,
        Dividendo: 8,
        Atualizacao: "2021-03-09 14:33:10"
    },
    {
        Codigo:"VILG11",
        Tipo:2,
        Categoria: 1,
        PrecoMedio: 12020,
        PrecoAtual: 11990,
        Posicao: 3,
        DividendYeld: 0,
        Dividendo: 0,
        Atualizacao: "2021-03-09 14:33:10"
    },
    {
        Codigo:"VINO11",
        Tipo:2,
        Categoria: 4,
        PrecoMedio: 6127,
        PrecoAtual: 6150,
        Posicao: 9,
        DividendYeld: 0,
        Dividendo: 0,
        Atualizacao: "2021-03-09 14:33:10"
    },
    {
        Codigo:"VRTA11",
        Tipo:2,
        Categoria: 5,
        PrecoMedio: 11481,
        PrecoAtual: 11480,
        Posicao: 4,
        DividendYeld: 0,
        Dividendo: 0,
        Atualizacao: "2021-03-09 14:33:10"
    },
    {
        Codigo:"VISC11",
        Tipo:2,
        Categoria: 2,
        PrecoMedio: 11676,
        PrecoAtual: 10840,
        Posicao: 2,
        DividendYeld: 800,
        Dividendo: 8,
        Atualizacao: "2021-03-09 14:33:10"
    },
]

const Storage = {
    get() {
        //return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        //localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const DOM = {
    tableCarteira: document.querySelector('#carteira table tbody'),
    escreveLinhaAtivo(ativo, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.escreveColunasAtivo(ativo,index)
        tr.dataset.index = index
        DOM.tableCarteira.appendChild(tr)
        var lim = new Date(ativo.Atualizacao)
        lim.setDate(lim.getDate() + 2)
        //console.log(aut)
        //console.log(lim)
        var hoj = new Date()
        if (hoj.getTime() > lim.getTime()) {
            Utils.buscaAtualizacoesAtivo(ativo,index)
        }
    },
    escreveColunasAtivo(ativo,index) {
        //const CssClass = transaction.amount > 0 ? 'income' : 'expense'
        const categoria = CategoriasAtivo.find( item => item.Codigo === ativo.Categoria )
        const precoMedio = Utils.formatCurrency(ativo.PrecoMedio)
        const precoAtual = Utils.formatCurrency(ativo.PrecoAtual)
        const corPrecoMedio = (ativo.PrecoMedio < ativo.PrecoAtual) ? "baixa" : "alta" 
        const corPrecoAtual = (ativo.PrecoMedio > ativo.PrecoAtual) ? "baixa" : "alta"
        const atualizacao = Utils.formatData(ativo.Atualizacao,)
        const patrimonio = Utils.formatCurrency(Number(ativo.PrecoAtual) * Number(ativo.Posicao))
        const dividendYeld = Utils.formatPercent(ativo.DividendYeld)
        const dividendo = Utils.formatCurrency(ativo.Dividendo)
        const dividendos = Utils.formatCurrency(Number(ativo.Dividendo) * Number(ativo.Posicao))
        const html = `
            <td>${categoria.Descricao}</td>
            <td><span class="ativo">${ativo.Codigo}</span></td>
            <td><span class="${corPrecoMedio}">${precoMedio}</span></td>
            <td><span class="${corPrecoAtual}">${precoAtual}</span><span class="atualizacao">Atualizado em ${atualizacao}</span></td>
            <td>${ativo.Posicao}</td>
            <td>${patrimonio}</td>
            <td>${dividendYeld}</td>
            <td>${dividendo}</td>
            <td>${dividendos}</td>
        `
        return html
    },
    informaAtualizacaoAtivo(ativo,index) {
        const linha = document.querySelector(`#carteira table tbody tr[data-index="${index}"]`)
        linha.innerHTML = `<td colspan="9">Ativo ${ativo.Codigo} tem mais de 48h, atualizando...</td>`
    }
    /*
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
    */
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
    formatPercent(value) {
        const signal = Number(value) < 0 ? '-' : ''
        value = String(value).replace(/\D/g,'')     // pega todos os não numeros da string e substitui por vazio
        value = Number(value/10000).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
        const currency = signal + value
        return currency
    },
    formatData(value,opt) {
        //const aux = value.split("-")
        //value = `${aux[2]}/${aux[1]}/${aux[1]}`
        const d = new Date(value)
        return d.toLocaleString("pt-BR",{ year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    formatAmount(value) {
        value = Number(value) * 100
        // value = Number(value.replace(/\,\./g, "") * 100)
        // as duas formas funcionam, deixei aqui só pelo regex
        return value
    },
    buscaAtualizacoesAtivo(ativo,index) {
        DOM.informaAtualizacaoAtivo(ativo,index)
        
    }
    
}

const App = {
    init() {
        // busca ativos e ordena por categoria
        Ativos.sort((a, b) => (a.Categoria > b.Categoria) ? 1 : -1)
        // escreve as linhas
        Ativos.forEach((ativo,index) => {
            DOM.escreveLinhaAtivo(ativo,index)
        });
    }
}

App.init()