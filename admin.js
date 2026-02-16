// ---------------- Supabase Setup ----------------
const SUPABASE_URL = 'https://kzjjmfvsjukbdhzewbwb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gvgEIJWkRM8O329u3jH9Zw_RmgRT9TT';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------- Global Products Array ----------------
let products = [];

// ---------------- Fetch Products ----------------
async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error) {
        console.error("Fetch Error:", error);
        return;
    }
    products = data;
    renderProducts();
}

// ---------------- Add Product ----------------
async function addProduct() {
    const name = document.getElementById("newName").value.trim();
    const desc = document.getElementById("newDesc").value.trim();
    const price = parseFloat(document.getElementById("newPrice").value);
    const files = document.getElementById("newImages").files;

    if (!name || !price) return alert("Name and Price required");

    const images = [];
    for (let i = 0; i < files.length; i++) {
        images.push(await fileToBase64(files[i]));
    }

    const { data, error } = await supabase.from('products').insert([{
        name,
        description: desc,
        price,
        images
    }]);

    if (error) {
        console.error("Insert Error:", error);
        alert("Failed to add product");
    } else {
        alert("Product added live!");
        clearInputs();
        fetchProducts();
    }
}

// ---------------- Delete Product ----------------
async function deleteProduct(id) {
    const { data, error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
        console.error("Delete Error:", error);
        alert("Failed to delete product");
    } else {
        fetchProducts();
    }
}

// ---------------- Render Products ----------------
function renderProducts() {
    const list = document.getElementById("productList");
    list.innerHTML = "";
    products.forEach(p => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p>Price: ${p.price}</p>
            <div>
                ${p.images.map(img => `<img src="${img}" width="80" height="80">`).join(' ')}
            </div>
            <button onclick="deleteProduct(${p.id})">Delete</button>
            <hr>
        `;
        list.appendChild(div);
    });
}

// ---------------- Helpers ----------------
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
    });
}

function clearInputs() {
    document.getElementById("newName").value = "";
    document.getElementById("newDesc").value = "";
    document.getElementById("newPrice").value = "";
    document.getElementById("newImages").value = "";
}

// ---------------- Initial Load ----------------
fetchProducts();
