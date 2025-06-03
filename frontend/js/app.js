// DOM Elements
const beerForm = document.getElementById('beer-form');
const beerList = document.getElementById('beer-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById('beer-modal');
const closeModal = document.querySelector('.close');
const beerDetails = document.getElementById('beer-details');

// API URL
const API_URL = '/api/beers';

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchBeers);
beerForm.addEventListener('submit', createBeer);
searchBtn.addEventListener('click', searchBeers);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchBeers();
});
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Fetch all beers from API
async function fetchBeers() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.status === 'success') {
            renderBeerList(data.data.beers);
        }
    } catch (error) {
        console.error('Error fetching beers:', error);
        showMessage('Erro ao carregar cervejas. Tente novamente mais tarde.', 'error');
    }
}

// Create a new beer
async function createBeer(e) {
    e.preventDefault();
    
    const formData = new FormData(beerForm);
    const beerData = {};
    
    formData.forEach((value, key) => {
        beerData[key] = value;
    });
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(beerData)
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            beerForm.reset();
            fetchBeers();
            showMessage('Cerveja cadastrada com sucesso!', 'success');
        } else {
            showMessage(`Erro: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error creating beer:', error);
        showMessage('Erro ao cadastrar cerveja. Tente novamente mais tarde.', 'error');
    }
}

// Search beers
function searchBeers() {
    const searchTerm = searchInput.value.toLowerCase();
    const beerCards = document.querySelectorAll('.beer-card');
    
    beerCards.forEach(card => {
        const beerName = card.querySelector('h3').textContent.toLowerCase();
        const beerBrand = card.querySelector('.brand').textContent.toLowerCase();
        const beerType = card.querySelector('.type').textContent.toLowerCase();
        
        if (beerName.includes(searchTerm) || 
            beerBrand.includes(searchTerm) || 
            beerType.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Render beer list
function renderBeerList(beers) {
    beerList.innerHTML = '';
    
    if (beers.length === 0) {
        beerList.innerHTML = '<p class="no-beers">Nenhuma cerveja cadastrada. Adicione uma nova cerveja!</p>';
        return;
    }
    
    beers.forEach(beer => {
        const beerCard = document.createElement('div');
        beerCard.classList.add('beer-card');
        beerCard.innerHTML = `
            <div class="beer-card-image">
                <img src="${beer.imageUrl || 'https://via.placeholder.com/300x180?text=Cerveja'}" alt="${beer.name}">
            </div>
            <div class="beer-card-content">
                <h3>${beer.name}</h3>
                <p class="brand"><strong>Marca:</strong> ${beer.brand}</p>
                <p class="type"><strong>Tipo:</strong> ${beer.type}</p>
                <p><strong>Teor Alcoólico:</strong> ${beer.alcoholContent}%</p>
                <div class="beer-card-actions">
                    <button class="view-btn" data-id="${beer._id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" data-id="${beer._id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${beer._id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        beerList.appendChild(beerCard);
        
        // Add event listeners for card actions
        beerCard.querySelector('.view-btn').addEventListener('click', () => viewBeer(beer._id));
        beerCard.querySelector('.edit-btn').addEventListener('click', () => editBeer(beer._id));
        beerCard.querySelector('.delete-btn').addEventListener('click', () => deleteBeer(beer._id));
    });
}

// View beer details
async function viewBeer(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            const beer = data.data.beer;
            
            beerDetails.innerHTML = `
                <div class="beer-details-container">
                    <div class="beer-details-image">
                        <img src="${beer.imageUrl || 'https://via.placeholder.com/300x180?text=Cerveja'}" alt="${beer.name}">
                    </div>
                    <div class="beer-details-content">
                        <h3>${beer.name}</h3>
                        <p><span class="label">Marca:</span> ${beer.brand}</p>
                        <p><span class="label">Tipo:</span> ${beer.type}</p>
                        <p><span class="label">Teor Alcoólico:</span> ${beer.alcoholContent}%</p>
                        <p><span class="label">País de Origem:</span> ${beer.origin || 'Não informado'}</p>
                        <p><span class="label">Descrição:</span> ${beer.description || 'Sem descrição disponível'}</p>
                        <p><span class="label">Data de Cadastro:</span> ${new Date(beer.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        } else {
            showMessage(`Erro: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error viewing beer:', error);
        showMessage('Erro ao visualizar detalhes da cerveja. Tente novamente mais tarde.', 'error');
    }
}

// Edit beer
async function editBeer(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            const beer = data.data.beer;
            
            // Fill form with beer data
            document.getElementById('name').value = beer.name;
            document.getElementById('brand').value = beer.brand;
            document.getElementById('type').value = beer.type;
            document.getElementById('alcoholContent').value = beer.alcoholContent;
            document.getElementById('origin').value = beer.origin || '';
            document.getElementById('description').value = beer.description || '';
            document.getElementById('imageUrl').value = beer.imageUrl || '';
            
            // Change form submit handler to update beer
            beerForm.removeEventListener('submit', createBeer);
            beerForm.addEventListener('submit', (e) => updateBeer(e, id));
            
            // Change form title and button text
            document.querySelector('.beer-form-container h2').textContent = 'Editar Cerveja';
            document.querySelector('button[type="submit"]').textContent = 'Atualizar';
            
            // Add cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.classList.add('btn', 'btn-secondary');
            cancelBtn.textContent = 'Cancelar';
            cancelBtn.addEventListener('click', resetForm);
            
            const resetBtn = document.querySelector('button[type="reset"]');
            resetBtn.parentNode.insertBefore(cancelBtn, resetBtn);
            resetBtn.style.display = 'none';
            
            // Scroll to form
            document.querySelector('.beer-form-container').scrollIntoView({ behavior: 'smooth' });
        } else {
            showMessage(`Erro: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error editing beer:', error);
        showMessage('Erro ao editar cerveja. Tente novamente mais tarde.', 'error');
    }
}

// Update beer
async function updateBeer(e, id) {
    e.preventDefault();
    
    const formData = new FormData(beerForm);
    const beerData = {};
    
    formData.forEach((value, key) => {
        beerData[key] = value;
    });
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(beerData)
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            resetForm();
            fetchBeers();
            showMessage('Cerveja atualizada com sucesso!', 'success');
        } else {
            showMessage(`Erro: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error updating beer:', error);
        showMessage('Erro ao atualizar cerveja. Tente novamente mais tarde.', 'error');
    }
}

// Delete beer
async function deleteBeer(id) {
    if (!confirm('Tem certeza que deseja excluir esta cerveja?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.status === 204) {
            fetchBeers();
            showMessage('Cerveja excluída com sucesso!', 'success');
        } else {
            const data = await response.json();
            showMessage(`Erro: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting beer:', error);
        showMessage('Erro ao excluir cerveja. Tente novamente mais tarde.', 'error');
    }
}

// Reset form to create mode
function resetForm() {
    beerForm.reset();
    
    // Change form title and button text back
    document.querySelector('.beer-form-container h2').textContent = 'Cadastrar Nova Cerveja';
    document.querySelector('button[type="submit"]').textContent = 'Cadastrar';
    
    // Remove cancel button and show reset button
    const cancelBtn = document.querySelector('button[type="button"]');
    if (cancelBtn) cancelBtn.remove();
    
    const resetBtn = document.querySelector('button[type="reset"]');
    resetBtn.style.display = 'inline-block';
    
    // Change form submit handler back to create beer
    beerForm.removeEventListener('submit', updateBeer);
    beerForm.addEventListener('submit', createBeer);
}

// Show message to user
function showMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 3000);
}
