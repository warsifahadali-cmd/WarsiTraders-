// Safe Supabase Setup
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let products = [];

// Fetch products from Supabase
async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error) console.error(error);
    else {
        products = data;
        renderProducts();
    }
}

async function addProduct() {
    const name = document.getElementById("newName").value;
    const desc = document.getElementById("newDesc").value;
    const price = parseFloat(document.getElementById("newPrice").value);
    const files = document.getElementById("newImages").files;

    if (!name || !price) return alert("Name and Price required");

    const images = [];

    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            images.push(e.target.result);
            if (images.length === files.length) saveProduct(name, desc, price, images);
        }
        reader.readAsDataURL(files[i]);
    }
}

async function saveProduct(name, desc, price, images) {
    const { data, error } = await supabase.from('products').insert([{ name, description: desc, price, images }]);
    if (error) console.error(error);
    else {
        alert("Product added live!");
        fetchProducts();
    }
}

function renderProducts() {
    const list = document.getElementById("productList");
    list.innerHTML = "";
    products.forEach(p => {
        const div = document.createElement("div");
        div.innerHTML = `
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>${p.price}</p>
        <button onclick="deleteProduct(${p.id})">Delete</button>
        `;
        list.appendChild(div);
    });
}

async function deleteProduct(id) {
    const { data, error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error(error);
    else fetchProducts();
}

// Initial fetch
fetchProducts();
