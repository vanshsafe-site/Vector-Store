
let products = [];
async function loadProducts(){

    const { data, error } =
    await supabaseClient
    .from("products")
        .select("*");

    if(error){

        console.error(error);

        return;
    }

    products = data;

    displayProducts(products);

}
const productContainer =
document.getElementById("productContainer");

if(productContainer){

    loadProducts();

    const searchInput =
    document.getElementById("searchInput");

    searchInput.addEventListener("input", () => {

        const value =
        searchInput.value.toLowerCase();

        const filtered =
        products.filter(product =>
            product.name.toLowerCase()
            .includes(value)
        );

        displayProducts(filtered);

    });
}

function displayProducts(productList){

    productContainer.innerHTML = "";

    productList.forEach(product => {

        productContainer.innerHTML += `
        
        <div class="product-card">

            <h3>${product.name}</h3>

            <div class="price">
                ₹${product.price}
            </div>

            <div class="stock ${
                product.stock > 0
                    ? "in-stock"
                    : "out-stock"
            }">

                ${
                    product.stock > 0
                    ? "In Stock"
                    : "Out Of Stock"
                }

            </div>

           <button onclick="addToCart(${product.id})">
                     Add To Cart
            </button>

        </div>
        
        `;
    });
}
let cart =
JSON.parse(localStorage.getItem("cart")) || [];
function addToCart(id){

    const product =
    products.find(p => p.id === id);

    const existing =
    cart.find(item => item.id === id);

    if(existing){

        existing.quantity++;

    }else{

       cart.push({
        ...product,
        quantity: 1
});

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Added to cart");

}
const cartContainer =
document.getElementById("cartContainer");

if(cartContainer){

    renderCart();

}
function renderCart(){

    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total +=
        item.price * item.quantity;

        cartContainer.innerHTML += `

        <div class="cart-item">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p>
                    ₹${item.price}
                </p>

            </div>

            <div class="cart-controls">

                <button
                class="qty-btn"
                onclick="decreaseQty(${item.id})">
                    -
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                class="qty-btn"
                onclick="increaseQty(${item.id})">
                    +
                </button>

                <button
                class="remove-btn"
                onclick="removeItem(${item.id})">
                    Remove
                </button>

            </div>

        </div>

        `;

    });

    const cartTotal =
document.getElementById("cartTotal");

if(cartTotal){
    cartTotal.innerText = total;
}

}
function increaseQty(id){

    const item =
    cart.find(item => item.id === id);

    item.quantity++;

    saveCart();

}
function decreaseQty(id){

    const item =
    cart.find(item => item.id === id);

    if(item.quantity > 1){

        item.quantity--;

    }

    saveCart();

}
function removeItem(id){

    cart =
    cart.filter(item =>
        item.id !== id
    );

    saveCart();

}
function saveCart(){

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();

}

const checkoutItems =
document.getElementById(
    "checkoutItems"
);

if(checkoutItems){

    renderCheckout();

}
function renderCheckout(){

    const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    let total = 0;

    if(!checkoutItems) return;

checkoutItems.innerHTML = "";

    cart.forEach(item => {

        const subtotal =
        item.price * item.quantity;

        total += subtotal;

        checkoutItems.innerHTML += `

        <div class="checkout-item">

            <span>
                ${item.name}
                x ${item.quantity}
            </span>

            <span>
                ₹${subtotal}
            </span>

        </div>

        `;

    });

  const checkoutTotal =
document.getElementById("checkoutTotal");

if(checkoutTotal){
    checkoutTotal.innerText = total;
}
}
const checkoutForm =
document.getElementById(
    "checkoutForm"
);

if(checkoutForm){

    checkoutForm.addEventListener(
        "submit",
        placeOrder
    );

}
async function placeOrder(e) {

    e.preventDefault();

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const total =
        cart.reduce(
            (sum, item) =>
                sum + (item.price * item.quantity),
            0
        );

    const order = {

        business_name:
        document.getElementById(
            "businessName"
        ).value,

        contact_person:
        document.getElementById(
            "contactPerson"
        ).value,

        phone:
        document.getElementById(
            "phone"
        ).value,

        email:
        document.getElementById(
        "email"
        ).value,

        address:
        document.getElementById(
            "address"
        ).value,

        gst:
        document.getElementById(
            "gst"
        ).value,

        items: cart,

        total: total,

        status: "Pending"
    };

    const { data, error } =
        await supabaseClient
        .from("orders")
        .insert([order]);

    if (error) {

    console.error("FULL ERROR:", error);

    alert(error.message);

    return;
}
    console.log(
        "Order saved:",
        data
    );

    localStorage.removeItem(
        "cart"
    );

    window.location.href =
        "order-success.html";
}
// ===============================
// ADMIN LOGIN
// ===============================


// ADMIN LOGIN
// ===============================

const adminLoginForm =
document.getElementById("adminLoginForm");


if(adminLoginForm){

adminLoginForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();


const email =
document.getElementById(
"email"
).value;


const password =
document.getElementById(
"password"
).value;



const {data,error} =
await supabaseClient.auth
.signInWithPassword({

email: email,

password: password

});



if(error){

console.error(error);

alert(
"Login failed: " + error.message
);

return;

}



alert("Login successful");


window.location.href =
"admin-dashboard.html";


});


}
const productForm =
document.getElementById(
    "productForm"
);

if(productForm){

    loadAdminProducts();

    productForm.addEventListener(
        "submit",
        saveProduct
    );

}
async function saveProduct(e){

    e.preventDefault();

    const id =
    document.getElementById(
        "productId"
    ).value;

    const product = {

        name:
        document.getElementById(
            "productName"
        ).value,

        description:
        document.getElementById(
            "productDescription"
        ).value,

        price:
        Number(
            document.getElementById(
                "productPrice"
            ).value
        ),

        stock:
        Number(
            document.getElementById(
                "productStock"
            ).value
        ),

        category:
        document.getElementById(
            "productCategory"
        ).value,

        image_url:
        document.getElementById(
            "productImage"
        ).value
    };

    let error;

    if(id){

        ({ error } =
            await supabaseClient
            .from("products")
            .update(product)
            .eq("id", id)
        );

    } else {

        ({ error } =
            await supabaseClient
            .from("products")
            .insert([product])
        );

    }

    if(error){

        console.error(error);

        alert(error.message);

        return;
    }

    productForm.reset();

    document.getElementById(
        "productId"
    ).value = "";

    loadAdminProducts();

}

async function loadAdminProducts() {

    const productsTable =
    document.getElementById(
        "productsTable"
    );

    if(!productsTable) return;

    const {
        data: products,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .order("id");

    if(error){

        console.error(
            "Failed to load products:",
            error
        );

        return;
    }

    productsTable.innerHTML = "";

    products.forEach(product => {

        productsTable.innerHTML += `

        <div class="admin-product-card">

            <h3>
                ${product.name}
            </h3>

            <p>
                ${product.description || ""}
            </p>

            <p>
                ₹${product.price}
            </p>

            <p>
                Stock:
                ${product.stock}
            </p>

            <p>
                ${
                    product.stock > 0
                    ? "In Stock"
                    : "Out Of Stock"
                }
            </p>

            <div
            class="admin-product-actions">

                <button
                class="edit-btn"
                onclick="editProduct('${product.id}')">

                    Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteProduct('${product.id}')">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}
async function editProduct(id){

    const {
        data: product,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if(error){

        console.error(error);

        alert(error.message);

        return;
    }

    document.getElementById(
        "productId"
    ).value =
    product.id;

    document.getElementById(
        "productName"
    ).value =
    product.name;

    document.getElementById(
        "productDescription"
    ).value =
    product.description || "";

    document.getElementById(
        "productPrice"
    ).value =
    product.price;

    document.getElementById(
        "productStock"
    ).value =
    product.stock;

    document.getElementById(
        "productCategory"
    ).value =
    product.category || "";

    document.getElementById(
        "productImage"
    ).value =
    product.image_url || "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
async function deleteProduct(id){

    if(
        !confirm(
            "Delete this product?"
        )
    ) return;

    const { error } =
        await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);

    if(error){

        console.error(error);

        alert(error.message);

        return;
    }

    loadAdminProducts();

}
async function loadOrders(){

    const ordersTable =
    document.getElementById(
        "ordersTable"
    );

    if(!ordersTable) return;

    const {
        data: orders,
        error
    } = await supabaseClient
        .from("orders")
        .select("*")
        .order(
            "created_at",
            { ascending:false }
        );

    if(error){

        console.error(error);

        return;
    }

    ordersTable.innerHTML = "";

    orders.forEach(order => {


    let itemsHTML = "";

    let items = order.items;


    // Handle JSON string or already parsed JSON
    if(typeof items === "string"){

        items = JSON.parse(items);

    }


    if(items && items.length){

        items.forEach(item => {

            itemsHTML += `

            <div>
                ${item.name}
                × ${item.quantity}
            </div>

            `;

        });

    }
    else{

        itemsHTML = "No items";

    }




    ordersTable.innerHTML += `


    <tr>


        <td>
            ${order.id}
        </td>



        <td>
            ${order.business_name}
        </td>




        <td>

            <strong>
            ${order.contact_person}
            </strong>

            <br>

            📞 ${order.phone || "No phone"}

            <br>

            ✉️ ${order.email || "No email"}

        </td>





        <td>

            ${itemsHTML}

        </td>





        <td>
            ₹${order.total}
        </td>





        <td>
            ${order.status}
        </td>





        <td>

            ${
                new Date(
                    order.created_at
                ).toLocaleDateString()
            }

        </td>





        <td>


            <select

            onchange="
            updateOrderStatus(
                ${order.id},
                this.value
            )">


                <option
                value="Pending"

                ${
                    order.status === "Pending"
                    ? "selected"
                    : ""
                }>

                    Pending

                </option>





                <option
                value="Accepted"

                ${
                    order.status === "Accepted"
                    ? "selected"
                    : ""
                }>

                    Accepted

                </option>





                <option
                value="Dispatched"

                ${
                    order.status === "Dispatched"
                    ? "selected"
                    : ""
                }>

                    Dispatched

                </option>





                <option
                value="Delivered"

                ${
                    order.status === "Delivered"
                    ? "selected"
                    : ""
                }>

                    Delivered

                </option>



            </select>


        </td>



    </tr>


    `;


});
}
loadOrders();
async function updateOrderStatus(
    orderId,
    newStatus
){

    const { error } =
    await supabaseClient
        .from("orders")
        .update({
            status: newStatus
        })
        .eq(
            "id",
            orderId
        );

    if(error){

        console.error(error);

        alert(
            error.message
        );

        return;
    }

    loadOrders();

}
// ===============================
// ADMIN DASHBOARD
// ===============================

async function loadDashboard(){

    const dashboard =
    document.getElementById("totalOrders");

    // Only run on dashboard page
    if(!dashboard) return;


    // Get orders
    const {
        data: orders,
        error: orderError
    } =
    await supabaseClient
    .from("orders")
    .select("*")
    .order(
        "created_at",
        {ascending:false}
    );


    if(orderError){

        console.error(orderError);
        return;

    }


    // Get products
    const {
        data: products,
        error: productError
    } =
    await supabaseClient
    .from("products")
    .select("*");


    if(productError){

        console.error(productError);
        return;

    }



    // Stats

    let revenue = 0;
    let pending = 0;


    orders.forEach(order=>{

        revenue += Number(order.total);

        if(order.status === "Pending"){
            pending++;
        }

    });



    document.getElementById(
        "totalOrders"
    ).innerText =
    orders.length;



    document.getElementById(
        "pendingOrders"
    ).innerText =
    pending;



    document.getElementById(
        "totalProducts"
    ).innerText =
    products.length;



    document.getElementById(
        "totalRevenue"
    ).innerText =
    "₹" + revenue;



    // Store overview numbers

    document.getElementById(
        "storeProducts"
    ).innerText =
    products.length;


    document.getElementById(
        "storeOrders"
    ).innerText =
    orders.length;



    // Recent orders

    const recent =
    document.getElementById(
        "recentOrders"
    );


    recent.innerHTML="";


    orders.slice(0,5)
    .forEach(order=>{


        recent.innerHTML += `

        <div class="admin-product-card">

            <h3>
            ${order.business_name}
            </h3>

            <p>
            ₹${order.total}
            </p>

            <p>
            Status: ${order.status}
            </p>

        </div>

        `;

    });



    // Low stock

    const lowStock =
    document.getElementById(
        "lowStockProducts"
    );


    lowStock.innerHTML="";


    products
    .filter(p=>p.stock < 10)
    .forEach(product=>{


        lowStock.innerHTML += `

        <div class="admin-product-card">

            <h3>
            ${product.name}
            </h3>

            <p>
            Only ${product.stock} units remaining
            </p>

        </div>

        `;

    });



    // Activity feed

   

}


loadDashboard();

// ===============================
// ADMIN PAGE PROTECTION
// ===============================

async function protectAdminPages(){

    const adminPages =
    [
        "admin-dashboard.html",
        "admin-products.html",
        "admin-orders.html"
    ];


    const currentPage =
    window.location.pathname
    .split("/")
    .pop();



    if(adminPages.includes(currentPage)){


        const {
            data
        } =
        await supabaseClient.auth
        .getSession();



        if(!data.session){

            window.location.href =
            "admin-login.html";

        }

    }

}


protectAdminPages();

const logoutBtn =
document.getElementById("logoutBtn");


if(logoutBtn){

logoutBtn.addEventListener(
"click",
async()=>{


await supabaseClient.auth.signOut();


window.location.href =
"admin-login.html";


});


}