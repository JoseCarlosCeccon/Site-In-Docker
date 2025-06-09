// Função para alternar entre as abas
function showTab(tabName) {
    const tabs = document.getElementsByClassName('tab-content');
    const buttons = document.getElementsByClassName('tab-button');
    
    for (let tab of tabs) {
        tab.classList.remove('active');
    }
    
    for (let button of buttons) {
        button.classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Função para listar todas as cervejas
async function listarTodas() {
    try {
        const response = await fetch('http://localhost:5229/api/v1/cerveja');
        if (response.ok) {
            const cervejas = await response.json();
            atualizarTabela(cervejas);
        } else {
            alert('Erro ao buscar cervejas');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar cervejas');
    }
}

// Função para buscar por marca
async function buscarPorMarca() {
    const marca = document.getElementById('searchMarca').value;
    if (!marca) {
        alert('Por favor, digite uma marca para buscar');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5229/api/v1/cerveja/marca?marca=${encodeURIComponent(marca)}`);
        if (response.ok) {
            const cervejas = await response.json();
            atualizarTabela(cervejas);
        } else {
            alert('Erro ao buscar cervejas');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar cervejas');
    }
}

// Função para deletar uma cerveja
async function deletarCerveja(id) {
    if (!confirm('Tem certeza que deseja deletar esta cerveja?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5229/api/v1/cerveja/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Cerveja deletada com sucesso!');
            listarTodas(); // Atualiza a lista após deletar
        } else {
            alert('Erro ao deletar cerveja');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar cerveja');
    }
}

// Função para atualizar a tabela com as cervejas
function atualizarTabela(cervejas) {
    const tbody = document.getElementById('cervejasTableBody');
    tbody.innerHTML = '';

    cervejas.forEach(cerveja => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cerveja.marca}</td>
            <td>${cerveja.tipo}</td>
            <td>${cerveja.teorAlcoolico}%</td>
            <td>${cerveja.descricao}</td>
            <td>${cerveja.origem}</td>
            <td>
                <button onclick="deletarCerveja('${cerveja.id}')" class="delete-btn">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Carrega todas as cervejas quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    listarTodas();
}); 