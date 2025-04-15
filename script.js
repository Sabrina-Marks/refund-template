// Seleciona os elementos do formularios
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')


//Seleciona os elementos da lista
const expenseList = document.querySelector('ul')
const expenseQuantity = document.querySelector('aside header p span')
const expenseTotal = document.querySelector('aside header h2')


// Captura o evento do input para formatar valor
amount.oninput = () => {
    // Removendo letras de verificação de numeros (usando regex)
    let value = amount.value.replace(/\D/g, '')


    //Transforma o valor em centavos
    value = Number(value) / 100


    // O codigo acima remove as letras, o abaixo não deixa o usuario escrever letras
    amount.value = formatCurrentBRL(value)
   
}


//Formatando em real BR
function formatCurrentBRL(value){
    //Logica para formatar o valor no padrao BR
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })


    // Retorna o valor formatado
    return value
}


// Evento de formulario para obter valores
form.onsubmit = (event) => {
    //previne o recarregamento da pagina
    event.preventDefault()


    // Cria novo objeto com detalhes da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    // Chama a função que adiciona o item na lista
    expenseAdd(newExpense)
}
// adiciona um novo item na lista
function expenseAdd(newExpense){
    try {
        // Cria elemento de li para adicionar o item na lista
        const expenseItem = document.createElement('li')
        expenseItem.classList.add('expense')


        // cria o icone de img da categoria
        const expenseIcon = document.createElement('img')
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute('alt', newExpense.category_name)


        //criar a info da despesa
        const expenseInfo = document.createElement('div')
        expenseInfo.classList.add('expense-info')


        // criar o nome da despesas
        const expenseName = document.createElement('strong')
        expenseName.textContent = newExpense.expense


        // criar a categoria da despesa
        const expenseCategory = document.createElement('span')
        expenseCategory.textContent = newExpense.category_name


        // adiciona nome e categoria na div info
        expenseInfo.append(expenseName, expenseCategory)


        // cria o valor da despesa
        const expenseAmount = document.createElement('span')
        expenseAmount.classList.add('expense-amount')
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace('R$', '')}`
       
        // adiciona o icone de excluir
        const imgDelete = document.createElement('img')
        imgDelete.classList.add('remove-icon')
        imgDelete.setAttribute('src', 'img/remove.svg')
        imgDelete.setAttribute('alt', 'remover')


        //Adiciona as informações nos item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, imgDelete)


        //Adiciona o item na lista
        expenseList.append(expenseItem)


        //limpa o formulario para adicionar um novo
        clear()
        //atualiza os totais
        updateTotals()


    } catch (error){
        alert('Não foi possivel atualizar a lista de despesas.')
        console.log(error)
    }
}


// atualiza totais
function updateTotals(){
    try {
        //Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children
   
        //atuliza a quantidade da lista
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`


        // Variavel para incrementar o total
        let total = 0


        //percore cada item(li) da lista (ul)
        for(let item = 0; item <items.length; item++ ){
            const itemAmount = items[item].querySelector('.expense-amount')


            //removendo caracteres não numericos e substitui , pelo .
            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.')


            // converte valor pra float
            value = parseFloat(value)


            //Verifica se o numero é valido
            if(isNaN(value)){
                return alert('Não foi possivel calcular o total. O valor não parece ser um numero')
            }


            //incrementa o valor total
            total += Number(value)
        }


       // cria a span para valor formatado
       const symbolBRL = document.createElement('small')
       symbolBRL.textContent = 'R$'


       //Formata o valor e remove o R$ que sera exibido pela small com um estilo customizado
       total = formatCurrentBRL(total).toUpperCase().replace('R$', '')


       //Limpa o conteudo do html
       expenseTotal.innerHTML = ''


       //adiciona o simbolo da moeda e valor total formatado
       expenseTotal.append(symbolBRL, total)


    } catch (error) {
        console.log(error)
        alert('Não foi possivel atualizar totais')
    }
}


// Evento que captura o click nos itens
expenseList.addEventListener('click', function(event){
    //Verifica se o click foi no icone de remover
    if (event.target.classList.contains('remove-icon')){
        //obtem li pai do elemento que sera excluido
        const item = event.target.closest('.expense')
        // remove o item da lista
        item.remove()
    }


    updateTotals()
})


function clear (){
    //limpa os inputs
    expense.value = ''
    category.value = ''
    amount.value = ''


    //coloca foco no input de amount
    expense.focus()
}