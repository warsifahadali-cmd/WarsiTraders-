let products = []; // In-memory array

// Load products from products.json manually
fetch('products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    renderProducts();
  });

function addProduct() {
    const name = document.getElementById("newName").value;
    const desc = document.getElementById("newDesc").value;
    const price = document.getElementById("newPrice").value;
    const files = document.getElementById("newImages").files;

    if (!name || !price) return alert("Name and Price required");

    const product = { name, desc, price, images: [] };

    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            product.images.push(e.target.result);
            if (product.images.length === files.length) {
                products.push(product);
                renderProducts();
                alert("Product added! For permanent storage, manually update products.json in repo.");
            }
        }
        reader.readAsDataURL(files[i]);
    }
}

function renderProducts() {
    const list = document.getElementById("productList");
    list.innerHTML = "";
    products.forEach((p, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p>${p.price}</p>
        <button onclick="deleteProduct(${i})">Delete</button>
        `;
        list.appendChild(div);
    });
}

function deleteProduct(index) {
    products.splice(index, 1);
    renderProducts();
    alert("Product deleted! Update products.json manually for permanence.");
}
