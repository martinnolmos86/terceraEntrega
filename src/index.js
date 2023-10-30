import { error } from "console";
import { promises as fs } from "fs";

export default class ProductManager {
  constructor({ path }) {
    this.products = [];
    this.productIdCounter = 1;
    this.path = path;
    this.loadProducts();
  }

  //   Metodo para agregar producto

  async addProduct(title, description, price, thumbnail, code, stock) {
    // verificando si hay algun producto con el mismo codigo

    if (this.products.some((product) => product.code === code)) {
      throw new Error("Error: El código ya existe en la lista de productos.");
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: this.productIdCounter++,
    };

    // Validamos que tenga todos los campos con el if

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      typeof code !== "number" ||
      typeof stock !== "number"
    ) {
      console.error("Error: Los tipos de datos no son correctos.");
      return;
    }

    await this.loadProducts();
    this.products.push(newProduct);
    await this.saveProducts();
  }

  //   Metodo para mostrar el array

  async getProduct() {
    await this.loadProducts();
    return this.products;
  }

  // Metodo para buscar un producto por su id

  async getProductById(id) {
    const json = await fs.readFile(this.path, "utf-8");
    const prod = JSON.parse(json);
    const prodSearch = prod.find((p) => p.id === id);
    if (!prodSearch) throw new Error("No se encontro con ese id");
    return prodSearch;
  }

  // Metodo para actualizar producto

  async updateProduct(id, updatedProperties) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      throw new Error("Error: Producto no encontrado (Not found).");
    }

    if (updatedProperties.id) {
      throw new Error("No se permite cambiar el ID del producto.");
    }

    if (
      Object.keys(updatedProperties).some(
        (key) =>
          typeof updatedProperties[key] !== "string" &&
          typeof updatedProperties[key] !== "number"
      )
    ) {
      throw new Error(
        "Error: Los tipos de datos en las propiedades actualizadas no son correctos."
      );
    }

    // Actualiza solo las propiedades especificadas
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedProperties,
    };

    await this.saveProducts();
  }

  // Metodo para borrar producto

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      throw new Error("Error: Producto no encontrado (Not found).");
    }

    this.products.splice(productIndex, 1);
    await this.saveProducts();
  }

  // Metodo para guardar los productos en un archivo

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (err) {
      console.error("Error al guardar los productos:", err);
    }
  }

  // Metodo para leer el JSON y convertirlos en javascript

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (err) {
      this.products = [];
    }
  }
}

// Agregando productos

async function main() {
  const evento1 = new ProductManager({ path: "prod.json" });
  await evento1.addProduct("Caramelo", "Arcor", 122, "", 12, 15);
  await evento1.addProduct("Chicle", "Arcor", 32, "", 15, 18);
  await evento1.addProduct("dadsa", "Arcor", 15, "", 1, 18);
  await evento1.addProduct("Alfajor", "Arcor", 84, "", 115, 22);
  await evento1.addProduct("Turron", "Arcor", 55, "", 18, 18);
  await evento1.addProduct("Galletas", "Arcor", 27, "", 135, 12);
  await evento1.addProduct("Coca Cola", "Arcor", 82, "", 44, 18);
  await evento1.addProduct("Jugo", "Arcor", 22, "", 75, 17);
  await evento1.addProduct("Jugos de Agua", "Arcor", 30, "", 33, 18);

  console.log(await evento1.getProduct());
}

export { ProductManager };
