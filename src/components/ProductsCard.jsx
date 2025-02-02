import axios from "axios";
const apiBase = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function ProductsCard({ products, getCartData, setModalState, setSelectProduct }) {
  // 加入購物車
  const handleAddCart = async (id) => {
    try {
      await axios.post(`${apiBase}/api/${apiPath}/cart`, {
        data: {
          product_id: id,
          qty: 1,
        },
      });
      getCartData();
    } catch (error) {
      alert("加入購物車失敗");
    }
  };
  return (
    <>
      {products?.map((product) => {
        return (
          <div className="col" key={product.id}>
            <div className="card h-100">
              <img src={product.imageUrl} className="card-img-top object-fit-cover" style={{ height: "300px" }} />
              <div className="card-body h-auto">
                <div className="h-100 d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <div className="mt-auto d-flex justify-content-between ">
                    <button
                      type="button"
                      onClick={() => {
                        setModalState(true);
                        setSelectProduct(product);
                      }}
                      className="btn btn-primary"
                    >
                      詳細資料
                    </button>
                    <button type="button" onClick={() => handleAddCart(product.id)} className="btn btn-primary">
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ProductsCard;
