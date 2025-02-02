import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import ProductsCard from "./components/ProductsCard";
import OrderFrom from "./components/OrderForm";
import ProductModal from "./components/ProductModal";

const apiBase = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [shoppingCart, setShoppingCart] = useState([]);
  const [selectProduct, setSelectProduct] = useState({});
  const [modalState, setModalState] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 取得產品資料
  const getProductData = async (page) => {
    setIsScreenLoading(true);
    try {
      const respose = await axios.get(`${apiBase}/api/${apiPath}/products?page=${page}`);
      setProducts(respose.data.products);
      setPageInfo(respose.data.pagination);
    } catch (error) {
      alert("取得產品列表失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };
  // 取得購物車資料
  const getCartData = async () => {
    setIsScreenLoading(true);
    try {
      const respose = await axios.get(`${apiBase}/api/${apiPath}/cart`);
      setShoppingCart(respose.data.data.carts);
    } catch (error) {
      alert("取得購物車資料失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  useEffect(() => {
    getProductData(1);
    getCartData();
  }, []);

  return (
    <>
      <div className="container">
        <h1 className="mb-5">產品頁面</h1>
        <div className="row row-cols-4 g-3">
          <ProductsCard products={products} getCartData={getCartData} setModalState={setModalState} setSelectProduct={setSelectProduct} />
        </div>
      </div>

      <ProductModal modalState={modalState} setModalState={setModalState} selectProduct={selectProduct} />

      {shoppingCart.length >= 1 && (
        <div className="container text-center">
          <OrderFrom getCartData={getCartData} shoppingCart={shoppingCart} setIsScreenLoading={setIsScreenLoading} />
        </div>
      )}

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </>
  );
}

export default App;
