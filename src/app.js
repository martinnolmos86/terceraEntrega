import express from "express";
import ProductManager from "./index.js";

const app = express();
const evento1 = new ProductManager({ path: "prod.json" });

// app.get("/productos", async (req, res) => {
//   try {
//     const products = await evento1.getProduct();
//     console.log("Productos cargados en el servidor:", products);
//     res.json(products);
//   } catch (error) {
//     res.json({
//       status: "error",
//       message: error.message,
//     });
//   }
// });

app.get("/productos", async (req, res) => {
  try {
    const limit = req.query.limit; // Obtener el valor del parámetro de consulta "limit"
    let products = await evento1.getProduct();

    if (limit) {
      // Si se proporciona el parámetro "limit"
      const limitValue = parseInt(limit); // Convertir a número entero
      products = products.slice(0, limitValue); // Obtener solo los primeros 'limitValue' productos
    }

    console.log("Productos cargados en el servidor:", products);
    res.json(products);
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

// Ruta para obtener un producto por su ID

app.get("/productos/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const product = await evento1.getProductById(productId);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(8080, () => console.log("Puerto 8080 funcionando"));
