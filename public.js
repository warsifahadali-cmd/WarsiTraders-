let products = [];

// Button click listener
document.getElementById("addProductBtn").addEventListener("click", function(){
    const name = document.getElementById('newName').value;
    const desc = document.getElementById('newDesc').value;
    const price = document.getElementById('newPrice').value;
    const images = document.getElementById('newImage').files;

    if(!name || !desc || !price || images.length == 0){
        alert("Fill all fields and select images");
        return;
    }

    let imgArray = [];
    for(let i=0;i<images.length;i++){
        imgArray.push(URL.createObjectURL(images[i]));
    }

    db.collection("products").add({
        name: name,
        desc: desc,
        price: price,
        images: imgArray
    })
    .then(() => {
        alert("Product saved!");
        loadProductsFromFirebase();
        document.getElementById('newName').value="";
        document.getElementById('newDesc').value="";
        document.getElementById('newPrice').value="";
        document.getElementById('newImage').value="";
    })
    .catch(err => console.error(err));
});

// Load products from Firestore
function loadProductsFromFirebase() {
    db.collection("products").get().then(snapshot => {
        products = [];
        snapshot.forEach(doc => products.push(doc.data()));
        displayProducts(products);
    });
}

// Display products
function displayProducts(list) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    list.forEach((product,index)=>{
        let imgsHtml = product.images.map(img=>`<img src="${img}" width="100">`).join("");
        grid.innerHTML += `
            <div class="product-card">
                ${imgsHtml}
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <p>₹${product.price}</p>
                <button onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
    });
}

// Delete product from Firestore
function deleteProduct(index){
    let product = products[index];
    db.collection("products").where("name","==",product.name).get().then(snapshot=>{
        snapshot.forEach(doc=>doc.ref.delete());
        products.splice(index,1);
        displayProducts(products);
    });
}

// Load products on page open
window.onload = loadProductsFromFirebase;