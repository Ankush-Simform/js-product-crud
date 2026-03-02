import {
  getDB,
  saveDB,
  idCounter,
  updateIdCounter,
  resetIdCounter,
} from "./db.js";
import { debounce, toggleForm } from "./helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  displayProducts();
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", handleSearch);
  }
  document
    .getElementById("filterSelect")
    .addEventListener("change", sortProduct);
});


const handleSearch = debounce(() => {
  displayProducts();
}, 300);

function saveProduct() {
  const name = document.getElementById("prodName").value;
  const price = document.getElementById("prodPrice").value;
  const desc = document.getElementById("prodDesc").value;
  const imageFile = document.getElementById("prodImage").files[0];

  if (!name || !price || !imageFile) {
    alert("All fields are compulsory!");
    return;
  }

  console.log(imageFile);
  processImage(imageFile, function (imageData) {
    let products = getDB();
    const newProduct = {
      id: idCounter,
      name: name,
      price: price,
      desc: desc,
      image: imageData,
    };
    products.push(newProduct);
    console.log(products);
    saveDB(products);
    updateIdCounter();
    displayProducts();
  });
}

function displayProducts(products = null) {
  if (products === null) products = getDB();

  let tableBody = document.getElementById("tableBody");
  if (!products) {
    tableBody.innerHTML =
      '<tr> <td class="text-center">No data Available</td></tr>';
  }

  let searchValue = document.getElementById("searchInput").value.toLowerCase();

  let filtered = products.filter(
    (p) =>
      p.id.toString().toLowerCase().includes(searchValue) ||
      p.name.toLowerCase().includes(searchValue) ||
      p.desc.toLowerCase().includes(searchValue),
  );
  tableBody.innerHTML = "";
  if (filtered.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="7" class="text-center">No data available.</td></tr>';
    return;
  }

  filtered.forEach((product) => {
    tableBody.innerHTML += `  
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td><img src="${product.image}" style="height:150px; width:200px; object-fit:cover;" /></td>
        <td>$${product.price}</td>  
        <td>${product.desc}</td>
        <td class="text-center"><button class="btn btn-md btn-info"onclick="editProduct(${product.id})">Edit</button></td>
        <td class="text-center"><button class = "btn btn-md btn-danger" onclick="deleteProduct(${product.id})">Delete</button></td>
      </tr>`;
  });
}

function deleteProduct(id) {
  let products = getDB();
  products = products.filter((product) => product.id !== id);
  saveDB(products);
  displayProducts();
}

function sortProduct(e) {
  let products = getDB();
  let key = e.target.value;
  let s = e.target.options[e.target.selectedIndex].dataset.s;

  products.sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    if (typeof aVal === "string") {
      let res = aVal.localeCompare(bVal);
      return s === "asc" ? res : -res;
    } else {
      return s === "asc" ? aVal - bVal : bVal - aVal;
    }
  });
  displayProducts(products);
}

function editProduct(id) {
  let products = getDB();
  let productToEdit = products.find((p) => p.id === id);
  if (productToEdit) {
    document.getElementById("prodName").value = productToEdit.name;
    document.getElementById("prodPrice").value = productToEdit.price;

    document.getElementById("prodDesc").value = productToEdit.desc;
    toggleForm(idCounter);

    saveBtn.onclick = function () {
      updateProduct(id);
    };
  }
}

function updateProduct(id) {
  let editId;
  let products = getDB();
  let index = products.findIndex((p) => p.id === id);

  products[index].name = document.getElementById("prodName").value;
  products[index].price = document.getElementById("prodPrice").value;
  products[index].desc = document.getElementById("prodDesc").value;
  products;
  const imageFile = document.getElementById("prodImage").files[0];
  if (imageFile) {
    processImage(imageFile, function (imageData) {
      products[index].image = imageData;
      saveDB(products);
      displayProducts();
    });
  } else {
    saveDB(products);
  }

  saveDB(products);
  toggleForm();
}

const clearAll = (id) => {
  let products = getDB();
  localStorage.clear();
  resetIdCounter();
  displayProducts();
};

function processImage(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}

globalThis.saveProduct = saveProduct;
globalThis.deleteProduct = deleteProduct;
globalThis.toggleForm = toggleForm;
globalThis.editProduct = editProduct;
globalThis.updateProduct = updateProduct;
globalThis.clearAll = clearAll;
