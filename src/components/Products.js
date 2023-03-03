// eslint-disable-next-line
import { Search, SentimentDissatisfied } from "@mui/icons-material";
// eslint-disable-next-line
import {CircularProgress,Grid,InputAdornment,TextField,} from "@mui/material";
// eslint-disable-next-line
import { Box } from "@mui/system";
// eslint-disable-next-line
import axios from "axios";
// eslint-disable-next-line
import { useSnackbar } from "notistack";
// eslint-disable-next-line
import React, { useEffect, useState } from "react";
// eslint-disable-next-line
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
// eslint-disable-next-line
import ProductCard from "./ProductCard";
// eslint-disable-next-line
import Cart, {generateCartItems, generateCartItemsFrom} from "./Cart"


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] =useState([]);
  const [debounceTimeout, setDebounceTimeout] =useState(0);
  const [items, setItems] = useState([]);
// const[productData, setProductData]=useState([]);

  const token =localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
 
  const performAPICall = async () => {
    setIsLoading(true)
    try{
      const response=await axios.get(`${config.endpoint}/products`);
      console.log(response)
      setIsLoading(false);

      setProducts(response.data);
      setFilteredProducts(response.data);
      return response.data;
      // console.log(response.data)
    } catch (error) {
      setIsLoading(false);

      if(error.response && (error.response.status===500)){
        enqueueSnackbar(error.response.data.message,{variant:"Error", autoHideDuration:5000});
        return null
      }else{
        return enqueueSnackbar("Something went wrong. Check the backend console for more details", {variant:"Error",success:"false",autoHideDuration:5000})
     }
  };
}

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const performSearch = async (text) => {
    try{
      const response=await axios.get(`${config.endpoint}/products/search?value=${text}`);
  
      setFilteredProducts(response.data);
      return response.data;
    } catch (error) {

      if(error.response){ 
        if(error.response.status===404){
          setFilteredProducts([]);
        }
        if(error.response.status===500){
        enqueueSnackbar(error.response.data.message,{variant:"Error", autoHideDuration:5000});
      }else{
        return enqueueSnackbar("Could not fetch products.Check that the backend is running, reachable and returns valid JSOn", {variant:"Error",success:"false",autoHideDuration:5000})
     }
  };
 }
  }



  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const debounceSearch = (event, debounceTimeout) => {
    const value=event.target.value;
    if(debounceTimeout){
      clearTimeout(debounceTimeout)
    }
    const Timeout= setTimeout(() =>{
      performSearch(value);
    }, 500)
    setDebounceTimeout(Timeout)
  };


// eslint-disable-next-line
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    const response =await axios.get(`${config.endpoint}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };
  
  const updateCartItems = (cartData, products)=>{
    const cartItems = generateCartItemsFrom(cartData, products);
    setItems(cartItems)
    console.log(products)
    console.log(cartItems)
  }


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  // eslint-disable-next-line
  const isItemInCart = (items, productId) => {
    if(items) {
      return items.findIndex((item)=>item.productId===productId) !==-1;
    }
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  // eslint-disable-next-line
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token) {
      enqueueSnackbar("Login to add item to the cart", {variant:"warning"});
      return;
    }
    if(options.preventDuplicate && isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove the item.",
      {variant:"warning"}
      )
      return;
    }
    try {
      const response = await axios.post(`${config.endpoint}/cart`,
      {productId, qty},
      {headers: {
        Authorization: `Bearer ${token}`
      },
    }
    );
    updateCartItems(response.data, products)
    } catch(error) {
      if(error.response) {
        enqueueSnackbar(error.response.data.message, {variant:"warning"})
      } else {
        enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable and return valid JSON.",
        {variant:"warning"}
        )
      }
    }
  };


useEffect(()=>{
performAPICall();
// setProductData(data)
// eslint-disable-next-line
},[])

useEffect(()=>{
  if(localStorage.getItem("token")){
  let userToken = localStorage.getItem("token")
    fetchCart(userToken).then((carts)=>{
      return generateCartItemsFrom(carts ,products)
    }).then((res)=>{
      // console.log(res);
      setItems(res)
    })
  }
  // eslint-disable-next-line
},[products])

// useEffect(()=>{
//   const handler=async()=>{
//  const cartData=await fetchCart();
//   const cartDetails=generateCartItemsFrom(cartData, productsData);
//   setItems(cartDetails)
// }
//   handler()
//   // eslint-disable-next-line
//   },[])


  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size="small"
        InputProps={{
          className:"search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event)=>debounceSearch(event, debounceTimeout)}
       />
     </Header>
     <TextField
        className="search-mobile"
        size="small"
        InputProps={{
          className:"search",
          endAdornment: (
            <Search color="primary" />
         ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event)=>debounceSearch(event, debounceTimeout)}
        />

      

       <Grid container>
         <Grid item xs={12} md={9}>

           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>

           {isLoading ? (
             <Box className="loading">
               <CircularProgress />
               <h4>Loading products...</h4>
             </Box>
             ):(
            
             <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
             {filteredProducts.length ? (
               filteredProducts.map((product)=>(
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard product={product}
                  handleAddToCart={async ()=>{
                    await addToCart(
                      token,
                      items,
                      products,
                      product._id,
                      1,
                      {
                        preventDuplicate:true
                      }
                    )
                  }}
                  />
                </Grid>
               ))
               ):(
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{color:"#636363"}}>No products found</h4>
                </Box>
               )}
                </Grid>
             )}
             </Grid>
             <Grid item xs={12} md={3}  bgcolor="#E9FSE1">
          {token && (
            <Cart
            hasCheckoutButton
            products={products}
            items={items}
            handleQuantity={addToCart}
            />
          )}
          </Grid>     
       </Grid>
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
      
          {/* <Grid item xs={12} md={3} sm={12} lg={3} class="cart-desktop" bgcolor="#E9FSE1">
          {token && (
            <Cart
            hasCheckoutButton
            products={products}
            items={items}
            handleQuantity={addToCart}
            />
          )}
          </Grid> */}
        
      <Footer />
    </div>
  )
 }
              
          

export default Products;
