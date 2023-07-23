// Iniciar Socket:
const socket = io();

// Captura div head:
const head = document.getElementById('head');

// Captura parrafo 
const ParfCarts = document.getElementById('Parrafo');

// Captura tabla de carritos
const tableCarts = document.getElementById('tableCarts');


// Función para cargar la vista principal de carritos
fetch('/api/user')

  .then((response) => response.json())
  .then((data) => {

    // Aquí recibimos los datos del usuario en la variable 'data'
    let cartID = data.cartID;

    socket.emit("CartCid", (cartID))

    socket.on("CARTID", (cartCID) => {

      const CID = cartCID.products;

      // Head:
      let htmlHead = "";
      htmlHead += `
      <h1>Carrito:</h1>
      `;
      head.innerHTML = htmlHead;

      let htmlCartCID = ""
      
      // Cuerpo:
      htmlCartCID += `
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Descripción</th>
              <th>Img Front</th>
              <th>Img Back</th>
              <th>Precio</th>
              <th>Cantidad</th>
            </tr>
          </thead>`;

      CID.forEach((product) => {
        const {
          title,
          description,
          thumbnails,
          price
        } = product.product;
        const quantity = product.quantity;
        htmlCartCID += `
            <tr>
              <td id="${title}">${title}</td>
              <td class="description">${description}</td>
              <td><img src="${thumbnails[0]}" alt="${title}" class="Imgs"></td>
              <td><img src="${thumbnails[1]}" alt="${title}" class="Imgs"></td>
              <td>$${price}</td>
              <td>${quantity}</td>
            </tr>`;
      });

      tableCarts.innerHTML = htmlCartCID;

    });
  })