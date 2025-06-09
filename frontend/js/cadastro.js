document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            marca: document.getElementById('marca').value,
            tipo: document.getElementById('tipo').value,
            teorAlcoolico: parseFloat(document.getElementById('teorAlcoolico').value),
            descricao: document.getElementById('descricao').value,
            origem: document.getElementById('origem').value
        };

        try {
            const response = await fetch('http://localhost:5229/api/v1/cerveja', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Cerveja cadastrada com sucesso!');
                form.reset();
            } else {
                const error = await response.json();
                alert('Erro ao cadastrar cerveja: ' + (error.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar cerveja. Por favor, tente novamente.');
        }
    });
}); 