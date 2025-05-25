import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Products.js";
//Add Product: /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files; // Files are handled via multipart thats  why its here
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );
    await Product.create({ ...productData, image: imagesUrl });

    res.json({
      success: true,
      message: "Product added",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
//List` Product: /api/product/add
export const productList = async (req, res) => {
  try {
    const products = Product.find({}); //Empty object so that all items are fetched
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// Get single prododuct /api/product/:id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// Get Product stock  /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock }); //Product.findByIdAndUpdate expects the second parameter to be a object
    res.json({ success: true, message: "Stock updated" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
