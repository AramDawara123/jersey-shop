document.addEventListener('DOMContentLoaded', () => {
    const productTableBody = document.getElementById('product-list');
    const productForm = document.getElementById('product-form');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productImageInput = document.getElementById('product-image');
    const productIdInput = document.getElementById('product-id');
    const addButton = document.getElementById('add-btn');
    const saveButton = document.getElementById('save-btn');
    const resetButton = document.getElementById('reset-btn');
    let originalData = [];

    function loadLocalStorageData() {
        const storedData = localStorage.getItem('products');
        if (storedData) {
            originalData = JSON.parse(storedData);
            renderProducts();
        } else {
            fetchOriginalData();
        }
    }

    function fetchOriginalData() {
        fetch('products.json')
            .then((response) => response.json())
            .then((data) => {
                originalData = data;
                localStorage.setItem('products', JSON.stringify(originalData));
                renderProducts();
            })
            .catch((error) => console.error('Fetch error:', error));
    }

    function renderProducts() {
        productTableBody.innerHTML = '';
        originalData.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${product.imgUrl}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
                <td><input type="text" class="form-control product-name" value="${product.name}" data-index="${index}"></td>
                <td><input type="number" class="form-control product-price" value="${product.price}" data-index="${index}"></td>
                <td>
                    <button type="button" class="btn btn-warning edit-btn" data-index="${index}">Edit</button>
                    <button type="button" class="btn btn-danger remove-btn" data-index="${index}">Remove</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach((button) => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.remove-btn').forEach((button) => {
            button.addEventListener('click', handleRemove);
        });
    }

    function handleEdit(event) {
        const index = event.target.getAttribute('data-index');
        const product = originalData[index];

        productNameInput.value = product.name;
        productPriceInput.value = product.price;
        productIdInput.value = index;
        addButton.style.display = 'none';
        saveButton.style.display = 'inline-block';
    }

    function handleRemove(event) {
        const index = event.target.getAttribute('data-index');
        if (window.confirm(`Weet je zeker dat je "${originalData[index].name}" wilt verwijderen?`)) {
            originalData.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(originalData));
            renderProducts();
        }
    }

    function addProduct(event) {
        event.preventDefault();

        const name = productNameInput.value.trim();
        const price = parseFloat(productPriceInput.value);
        const imageFile = productImageInput.files[0];

        if (!name) {
            window.alert('Vul alstublieft de productnaam in.');
            return;
        }
        if (Number.isNaN(price)) {
            window.alert('Vul alstublieft een geldige prijs in.');
            return;
        }
        if (!imageFile) {
            window.alert('Selecteer alstublieft een afbeelding voor het product.');
            return;
        }

        const imgUrl = URL.createObjectURL(imageFile);
        const newProduct = { name, price, imgUrl };
        originalData.push(newProduct);
        localStorage.setItem('products', JSON.stringify(originalData));

        productForm.reset();
        renderProducts();
    }

    function saveProduct() {
        const index = parseInt(productIdInput.value, 10);
        const name = productNameInput.value.trim();
        const price = parseFloat(productPriceInput.value);
        const imageFile = productImageInput.files[0];

        if (!name) {
            window.alert('Vul alstublieft de productnaam in.');
            return;
        }
        
        if (Number.isNaN(price)) {
            window.alert('Vul alstublieft een geldige prijs in.');
            return;
        }

        if (imageFile) {
            const imgUrl = URL.createObjectURL(imageFile);
            originalData[index].imgUrl = imgUrl;
        }

        originalData[index].name = name;
        originalData[index].price = price;
        localStorage.setItem('products', JSON.stringify(originalData));

        productForm.reset();
        productIdInput.value = '';
        addButton.style.display = 'inline-block';
        saveButton.style.display = 'none';

        renderProducts();
    }

    function resetTable() {
        fetchOriginalData();
    }

    loadLocalStorageData();

    resetButton.addEventListener('click', resetTable);
    addButton.addEventListener('click', addProduct);
    saveButton.addEventListener('click', saveProduct);
});
