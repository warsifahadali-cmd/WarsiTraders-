document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addProductBtn");

    addBtn.addEventListener("click", async function() {
        const name = document.getElementById('newName').value.trim();
        const desc = document.getElementById('newDesc').value.trim();
        const price = document.getElementById('newPrice').value.trim();
        const images = document.getElementById('newImage').files;

        if(!name || !desc || !price || images.length===0){
            alert("Fill all fields and select images");
            return;
        }

        let imgUrls = [];

        for(let i=0;i<images.length;i++){
            const file = images[i];
            const storageRef = storage.ref().child(`products/${Date.now()}_${file.name}`);
            await storageRef.put(file);
            const url = await storageRef.getDownloadURL();
            imgUrls.push(url);
        }

        db.collection("products").add({
            name, desc, price, images: imgUrls
        }).then(()=>{
            alert("Product added!");
            loadProducts();
            document.getElementById('newName').value="";
            document.getElementById('newDesc').value="";
            document.getElementById('newPrice').value="";
            document.getElementById('newImage').value="";
        }).catch(err => console.error(err));
    });

    loadProducts();
});

function loadProducts(){
    db.collection("products").get().then(snapshot => {
        const products = [];
        snapshot.forEach(doc => products.push({id: doc.id, ...doc.data()}));
        displayProducts(products);
    });
}

function displayProducts(list){
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    list.forEach(product => {
        let imgsHtml = product.images.map(img=>`<img src="${img}" width="100">`).join("");
        grid.innerHTML += `
            <div class="product-card">
                ${imgsHtml}
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <p>₹${product.price}</p>
                <button onclick="deleteProduct('${product.id}')">Delete</button>
            </div>
        `;
    });
}

function deleteProduct(id){
    db.collection("products").doc(id).delete().then(loadProducts);
}
