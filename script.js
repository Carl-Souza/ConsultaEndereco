document.addEventListener('DOMContentLoaded', function () {
   
    populateStates();

    
    const cepForm = document.getElementById('cepForm');
    cepForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const cep = document.getElementById('cep').value.replace(/\D/g, '');

        if (validateCEP(cep)) {
            searchByCEP(cep);
        } else {
            showError('CEP inválido. Digite um CEP com 8 dígitos.');
        }
    });


    const stateCityForm = document.getElementById('stateCityForm');
    stateCityForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const state = document.getElementById('state').value;
        const city = document.getElementById('city').value.trim();

        if (state && city) {
            searchByStateCity(state, city);
        } else {
            showError('Preencha todos os campos para realizar a busca.');
        }
    });
});

function populateStates() {
    const states = [
        { uf: 'AC', name: 'Acre' },
        { uf: 'AL', name: 'Alagoas' },
        { uf: 'AP', name: 'Amapá' },
        { uf: 'AM', name: 'Amazonas' },
        { uf: 'BA', name: 'Bahia' },
        { uf: 'CE', name: 'Ceará' },
        { uf: 'DF', name: 'Distrito Federal' },
        { uf: 'ES', name: 'Espírito Santo' },
        { uf: 'GO', name: 'Goiás' },
        { uf: 'MA', name: 'Maranhão' },
        { uf: 'MT', name: 'Mato Grosso' },
        { uf: 'MS', name: 'Mato Grosso do Sul' },
        { uf: 'MG', name: 'Minas Gerais' },
        { uf: 'PA', name: 'Pará' },
        { uf: 'PB', name: 'Paraíba' },
        { uf: 'PR', name: 'Paraná' },
        { uf: 'PE', name: 'Pernambuco' },
        { uf: 'PI', name: 'Piauí' },
        { uf: 'RJ', name: 'Rio de Janeiro' },
        { uf: 'RN', name: 'Rio Grande do Norte' },
        { uf: 'RS', name: 'Rio Grande do Sul' },
        { uf: 'RO', name: 'Rondônia' },
        { uf: 'RR', name: 'Roraima' },
        { uf: 'SC', name: 'Santa Catarina' },
        { uf: 'SP', name: 'São Paulo' },
        { uf: 'SE', name: 'Sergipe' },
        { uf: 'TO', name: 'Tocantins' }
    ];

    const stateSelect = document.getElementById('state');

    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.uf;
        option.textContent = `${state.uf} - ${state.name}`;
        stateSelect.appendChild(option);
    });
}

function validateCEP(cep) {
    return /^[0-9]{8}$/.test(cep);
}

async function searchByCEP(cep) {
    showLoading();

    try {
        const response = await fetch(`https://viacep.com.br/ws/01001000/json/${cep}`);

        if (!response.ok) {
            throw new Error('CEP não encontrado');
        }

        const address = await response.json();
        displayResults([address]);
    } catch (error) {
        showError(error.message);
    }
}

async function searchByStateCity(state, city) {
    showLoading();

    try {
        const response = await fetch(`https://viacep.com.br/ws/01001000/json/state-city?state=${state}&city=${city}`);

        if (!response.ok) {
            throw new Error('Nenhum endereço encontrado para esta combinação de estado e cidade');
        }

        const addresses = await response.json();
        displayResults(addresses);
    } catch (error) {
        showError(error.message);
    }
}

function displayResults(addresses) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (addresses.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum endereço encontrado.</p>';
        return;
    }

    addresses.forEach(address => {
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';

        addressCard.innerHTML = `
            <p><strong>CEP:</strong> ${address.cep}</p>
            <p><strong>Logradouro:</strong> ${address.logradouro || 'Não informado'}</p>
            <p><strong>Complemento:</strong> ${address.complemento || 'Não informado'}</p>
            <p><strong>Bairro:</strong> ${address.bairro || 'Não informado'}</p>
            <p><strong>Cidade:</strong> ${address.localidade}</p>
            <p><strong>Estado:</strong> ${address.uf}</p>
            <p><strong>IBGE:</strong> ${address.ibge || 'Não informado'}</p>
            <p><strong>GIA:</strong> ${address.gia || 'Não informado'}</p>
            <p><strong>DDD:</strong> ${address.ddd || 'Não informado'}</p>
            <p><strong>SIAFI:</strong> ${address.siafi || 'Não informado'}</p>
        `;

        resultsContainer.appendChild(addressCard);
    });
}

function showError(message) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

function showLoading() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<div class="loading">Carregando...</div>';
}
