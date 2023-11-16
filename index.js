function downloadCSV() {
    const csvContent = "data:text/csv;charset=utf-8," +
        "ID,Nome,Sobrenome,CPF,Salário,Cargo\n" +
        listaFuncionarios.map(funcionario =>
            `${funcionario.id},"${funcionario.nome}","${funcionario.sobrenome}",${funcionario.cpf},${funcionario.salario},${funcionario.cargo}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "funcionarios.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the CSV file
}

function formatarCPFAoDigitar(cpf) {
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (cpf.length > 11) {
        cpf = cpf.slice(0, 11);
    }

    // Aplica a formatação enquanto digita
    if (cpf.length > 3) {
        cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (cpf.length > 6) {
        cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (cpf.length > 9) {
        cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    // Atualiza o campo com o valor formatado
    document.getElementById("cpf").value = cpf;
}


function formatarSalario(input) {
    const valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const valorFormatado = (parseFloat(valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    input.value = valorFormatado; // Atualiza o campo de entrada com o valor formatado
}

let listaFuncionarios = [];
let contadorId = 1;

function addFuncionario() {
    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const cpf = document.getElementById("cpf").value;
    const salarioInput = document.getElementById("salario");
    const salarioValor = salarioInput.value;
    const salario = parseFloat(salarioValor.replace(/\D/g, ''))/ 100; // Remove os caracteres não numéricos e divide por 100 para corrigir
    const cargo = document.getElementById("cargo").value;

    if (nome && !isNaN(salario) && cargo) {
        const funcionario = {
            id: contadorId,
            nome: nome,
            sobrenome: sobrenome,
            cpf: cpf,
            salario: salario.toFixed(2),
            cargo: cargo
        };

        listaFuncionarios.push(funcionario);
        contadorId++;
        console.log("Funcionário adicionado:", funcionario);
        salarioInput.value = ""; // Limpe o campo de entrada do salário
        nome.value = ""; // Limpe o campo de entrada do nome

        atualizarConteudo(); // Chama a função para atualizar o conteúdo na div
        downloadCSV(); // Chama a função para baixar o arquivo CSV
    } else {
        window.alert("Preencha todos os campos corretamente antes de adicionar um funcionário.");
    }

    
}
function atualizarConteudo() {
        const conteudoDiv = document.getElementById("divConteudo");
        conteudoDiv.innerHTML = ""; // Limpa o conteúdo atual
    
        listaFuncionarios.forEach((funcionario) => {
            const divFuncionario = document.createElement("ul");
            divFuncionario.innerHTML = `
            <h2 id="funcionarioh2">Funcionário #${funcionario.id}</h2>
            <li><strong>Nome: </strong> ${funcionario.nome} ${funcionario.sobrenome}</li>
            <li><strong>CPF: </strong> ${funcionario.cpf}</li> 
            <li><strong>Salário: </strong> ${funcionario.salario}</li> 
            <li><strong>Cargo: </strong> ${funcionario.cargo}</li>
            <div id="divLixo">
                <button id="botaoLixo" onclick="excluirFuncionario(${funcionario.id}); downloadCSV();"><i class="gg-trash"></i></button>
            </div>`;
            conteudoDiv.appendChild(divFuncionario); // Adiciona as informações do funcionário à div de conteúdo
        });
    }

    function excluirFuncionario(id) {
        const index = listaFuncionarios.findIndex(funcionario => funcionario.id === id);
        if (index !== -1) {
            listaFuncionarios.splice(index, 1);
            atualizarConteudo();
        }
    }