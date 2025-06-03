// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const beerList = document.getElementById('beerList');
    const emptyMessage = document.getElementById('emptyMessage');
    const searchInput = document.getElementById('searchInput');
    const newBeerBtn = document.getElementById('newBeerBtn');
    const showFormBtn = document.getElementById('showFormBtn');
    const beerForm = document.getElementById('beerForm');
    const saveBeerBtn = document.getElementById('saveBeerBtn');
    const editBeerBtn = document.getElementById('editBeerBtn');
    const deleteBeerBtn = document.getElementById('deleteBeerBtn');
    
    // Bootstrap Modals
    const beerModal = new bootstrap.Modal(document.getElementById('beerModal'));
    const viewBeerModal = new bootstrap.Modal(document.getElementById('viewBeerModal'));
    
    // Toast notification
    const toast = new bootstrap.Toast(document.getElementById('toast'));
    
    // API URL
    const API_URL = '/api/beers';
    
    // Event Listeners
    newBeerBtn.addEventListener('click', () => {
        resetForm();
        beerModal.show();
    });
    
    showFormBtn.addEventListener('click', () => {
        resetForm();
        beerModal.show();
    });
    
    saveBeerBtn.addEventListener('click', saveBeer);
    editBeerBtn.addEventListener('click', () => {
        viewBeerModal.hide();
        const beerId = document.getElementById('viewBeerName').dataset.id;
        prepareEditForm(beerId);
    });
    
    deleteBeerBtn.addEventListener('click', () => {
        const beerId = document.getElementById('viewBeerName').dataset.id;
        deleteBeer(beerId);
    });
    
    searchInput.addEventListener('input', filterBeers);
    
    // Initial data load
    fetchBeers();
    
    // Functions
    async function fetchBeers() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            if (response.ok) {
                renderBeerList(data.data.beers || data);
            } else {
                showToast('Erro', data.message || 'Erro ao carregar cervejas', 'danger');
            }
        } catch (error) {
            console.error('Error fetching beers:', error);
            showToast('Erro', 'Não foi possível conectar ao servidor', 'danger');
        }
    }
    
    function renderBeerList(beers) {
        beerList.innerHTML = '';
        
        if (!beers || beers.length === 0) {
            beerList.innerHTML = '';
            emptyMessage.style.display = 'block';
            return;
        }
        
        emptyMessage.style.display = 'none';
        
        beers.forEach(beer => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6 mb-4';
            
            col.innerHTML = `
                <div class="card beer-card">
                    <img src="${beer.imageUrl || 'https://via.placeholder.com/300x200?text=Cerveja'}" 
                         class="card-img-top" alt="${beer.name}">
                    <div class="card-body">
                        <h5 class="card-title">${beer.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${beer.brand}</h6>
                        <div>
                            <span class="badge bg-primary">${beer.type}</span>
                            <span class="badge bg-warning text-dark">${beer.alcoholContent}% alc.</span>
                        </div>
                        <p class="card-text">${beer.description || 'Sem descrição disponível.'}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-primary w-100" data-id="${beer._id}">
                            Ver detalhes
                        </button>
                    </div>
                </div>
            `;
            
            // Add click event to view details
            const viewBtn = col.querySelector('button');
            viewBtn.addEventListener('click', () => viewBeer(beer._id));
            
            beerList.appendChild(col);
        });
    }
    
    async function viewBeer(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                const beer = data.data.beer || data;
                
                // Populate view modal
                document.getElementById('viewBeerName').textContent = beer.name;
                document.getElementById('viewBeerName').dataset.id = beer._id;
                document.getElementById('viewBeerBrand').textContent = beer.brand;
                document.getElementById('viewBeerType').textContent = beer.type;
                document.getElementById('viewBeerAlcohol').textContent = beer.alcoholContent;
                document.getElementById('viewBeerDescription').textContent = beer.description || 'Sem descrição disponível.';
                document.getElementById('viewBeerOrigin').textContent = beer.origin || 'Não especificado';
                document.getElementById('viewBeerImage').src = beer.imageUrl || 'https://via.placeholder.com/300x300?text=Cerveja';
                
                viewBeerModal.show();
            } else {
                showToast('Erro', data.message || 'Erro ao carregar detalhes da cerveja', 'danger');
            }
        } catch (error) {
            console.error('Error fetching beer details:', error);
            showToast('Erro', 'Não foi possível conectar ao servidor', 'danger');
        }
    }
    
    async function prepareEditForm(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                const beer = data.data.beer || data;
                
                // Populate form fields
                document.getElementById('beerId').value = beer._id;
                document.getElementById('name').value = beer.name;
                document.getElementById('brand').value = beer.brand;
                document.getElementById('type').value = beer.type;
                document.getElementById('alcoholContent').value = beer.alcoholContent;
                document.getElementById('description').value = beer.description || '';
                document.getElementById('origin').value = beer.origin || '';
                document.getElementById('imageUrl').value = beer.imageUrl || '';
                
                // Change modal title
                document.getElementById('modalTitle').textContent = 'Editar Cerveja';
                
                beerModal.show();
            } else {
                showToast('Erro', data.message || 'Erro ao carregar dados da cerveja', 'danger');
            }
        } catch (error) {
            console.error('Error fetching beer for edit:', error);
            showToast('Erro', 'Não foi possível conectar ao servidor', 'danger');
        }
    }
    
    function resetForm() {
        beerForm.reset();
        document.getElementById('beerId').value = '';
        document.getElementById('modalTitle').textContent = 'Nova Cerveja';
    }
    
    async function saveBeer() {
        const beerId = document.getElementById('beerId').value;
        const isEdit = beerId !== '';
        
        const beerData = {
            name: document.getElementById('name').value,
            brand: document.getElementById('brand').value,
            type: document.getElementById('type').value,
            alcoholContent: document.getElementById('alcoholContent').value,
            description: document.getElementById('description').value,
            origin: document.getElementById('origin').value,
            imageUrl: document.getElementById('imageUrl').value
        };
        
        try {
            const url = isEdit ? `${API_URL}/${beerId}` : API_URL;
            const method = isEdit ? 'PATCH' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(beerData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                beerModal.hide();
                fetchBeers();
                showToast(
                    'Sucesso', 
                    isEdit ? 'Cerveja atualizada com sucesso!' : 'Cerveja cadastrada com sucesso!', 
                    'success'
                );
            } else {
                showToast('Erro', data.message || 'Erro ao salvar cerveja', 'danger');
            }
        } catch (error) {
            console.error('Error saving beer:', error);
            showToast('Erro', 'Não foi possível conectar ao servidor', 'danger');
        }
    }
    
    async function deleteBeer(id) {
        if (!confirm('Tem certeza que deseja excluir esta cerveja?')) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                viewBeerModal.hide();
                fetchBeers();
                showToast('Sucesso', 'Cerveja excluída com sucesso!', 'success');
            } else {
                const data = await response.json();
                showToast('Erro', data.message || 'Erro ao excluir cerveja', 'danger');
            }
        } catch (error) {
            console.error('Error deleting beer:', error);
            showToast('Erro', 'Não foi possível conectar ao servidor', 'danger');
        }
    }
    
    function filterBeers() {
        const searchTerm = searchInput.value.toLowerCase();
        const cards = beerList.querySelectorAll('.col-md-4');
        let hasVisibleCards = false;
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const brand = card.querySelector('.card-subtitle').textContent.toLowerCase();
            const type = card.querySelector('.badge.bg-primary').textContent.toLowerCase();
            const description = card.querySelector('.card-text').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || 
                brand.includes(searchTerm) || 
                type.includes(searchTerm) || 
                description.includes(searchTerm)) {
                card.style.display = '';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        emptyMessage.style.display = hasVisibleCards ? 'none' : 'block';
        if (!hasVisibleCards && searchTerm) {
            emptyMessage.innerHTML = `
                <i class="fas fa-search fa-4x mb-3 text-muted"></i>
                <h3>Nenhuma cerveja encontrada</h3>
                <p>Não encontramos cervejas com o termo "${searchTerm}"</p>
            `;
        } else {
            emptyMessage.innerHTML = `
                <i class="fas fa-beer fa-4x mb-3 text-muted"></i>
                <h3>Nenhuma cerveja cadastrada</h3>
                <p>Clique em "Nova Cerveja" para adicionar sua primeira cerveja ao sistema.</p>
            `;
        }
    }
    
    function showToast(title, message, type) {
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        const toastElement = document.getElementById('toast');
        
        // Set content
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        // Set color based on type
        toastElement.className = 'toast';
        toastElement.classList.add(`text-bg-${type}`);
        
        // Show toast
        toast.show();
    }
});
