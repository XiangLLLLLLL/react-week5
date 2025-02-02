import { useForm, useWatch } from "react-hook-form";
import axios from "axios";

const apiBase = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function OrderFrom({ getCartData, shoppingCart, setIsScreenLoading }) {
  // 更新數量
  const updateCartNum = async (cartId, productId, qty) => {
    try {
      await axios.put(`${apiBase}/api/${apiPath}/cart/${cartId}`, {
        data: {
          product_id: productId,
          qty,
        },
      });
      getCartData();
    } catch (error) {
      console.log(error);
      alert("修改數量失敗");
    }
  };
  // 刪除購物車資料(單筆)
  const delCartItem = async (cartId) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${apiBase}/api/${apiPath}/cart/${cartId}`);
      getCartData();
    } catch (error) {
      alert("刪除資料失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };
  // 刪除購物車資料(整筆)
  const delAllCartList = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${apiBase}/api/${apiPath}/carts`);
      getCartData();
    } catch (error) {
      alert("清空購物車失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };
  // 控制購物車表單功能(刪除、修改)
  const handleUpdateCart = (e) => {
    e.preventDefault();
    let id = e.target.closest("tr").getAttribute("data-id");
    let productId;
    let qty;
    if (e.target.classList.contains("discardAllBtn")) {
      delAllCartList();
    } else if (e.target.classList.contains("disBtn")) {
      delCartItem(id);
    } else if (e.target.classList.contains("addBtn")) {
      const result = shoppingCart.filter((item) => item.id === id);
      productId = result[0].product.id;
      qty = Number(result[0].qty) + 1;
      updateCartNum(id, productId, qty);
    } else if (e.target.classList.contains("minusBtn")) {
      const result = shoppingCart.filter((item) => item.id === id);
      productId = result[0].product.id;
      if (Number(result[0].qty) <= 1) {
        qty = 1;
      } else {
        qty = result[0].qty - 1;
      }
      updateCartNum(id, productId, qty);
    }
  };

  // 送出訂單
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    setIsScreenLoading(true);
    try {
      if (shoppingCart.length === 0) {
        alert("購物車內沒有商品");
        return;
      }
      const res = await axios.post(`${apiBase}/api/${apiPath}/order`, {
        data: {
          user: {
            name: data.name,
            email: data.email,
            tel: data.tel,
            address: data.address,
          },
          message: data.message,
        },
      });
      getCartData();
      reset();
    } catch (error) {
      alert("送出訂單失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <>
      <h1 className="mb-5">我的購物車</h1>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>產品名稱</th>
            <th>產品種類</th>
            <th>價格</th>
            <th>特價</th>
            <th>產品數量</th>
            <th>產品總價</th>
            <th>
              <button type="button" className="btn btn-danger disBtn discardAllBtn" onClick={handleUpdateCart}>
                刪除全部
              </button>
            </th>
          </tr>
        </thead>
        {shoppingCart?.map((cart) => {
          return (
            <tbody key={cart.id}>
              <tr data-id={cart.id}>
                <td>{cart.product.title}</td>
                <td>{cart.product.category}</td>
                <td>{cart.product.origin_price}</td>
                <td>{cart.product.price}</td>
                <td>
                  <button type="button" className="btn btn-outline-primary me-2 addBtn" onClick={handleUpdateCart}>
                    +
                  </button>
                  {cart.qty}
                  <button type="button" className="btn btn-outline-primary ms-2 minusBtn" onClick={handleUpdateCart}>
                    -
                  </button>
                </td>
                <td>{cart.total}</td>
                <td>
                  <button type="button" className="btn btn-danger disBtn" onClick={handleUpdateCart}>
                    刪除
                  </button>
                </td>
              </tr>
            </tbody>
          );
        })}
        <tfoot>
          <tr>
            <td colSpan="5">
              <div className="d-flex justify-content-end">
                <h3>總計:{shoppingCart?.reduce((acc, cur) => acc + cur.total, 0)}</h3>
              </div>
            </td>
            <td>
              <h3 className="text-success">
                已折:
                {shoppingCart?.reduce((acc, cur) => {
                  return acc + (cur.product.origin_price - cur.product.price) * cur.qty;
                }, 0)}
              </h3>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div className="row row-cols-2 justify-content-center">
        <div className="col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="InputEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                id="InputEmail"
                placeholder="請輸入Email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email 為必填",
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email 格式不正確",
                  },
                })}
              />
              <div className="invalid-feedback">{errors?.email?.message}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="InputName" className="form-label">
                收件人姓名
              </label>
              <input
                type="text"
                className={`form-control ${errors.name && "is-invalid"}`}
                id="InputName"
                placeholder="請輸入姓名"
                {...register("name", {
                  required: {
                    value: true,
                    message: "收件人姓名 為必填",
                  },
                })}
              />
              <div className="invalid-feedback">{errors?.name?.message}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="InputPhone" className="form-label">
                收件人電話
              </label>
              <input
                type="tel"
                className={`form-control ${errors.tel && "is-invalid"}`}
                id="InputPhone"
                placeholder="請輸入電話"
                {...register("tel", {
                  required: {
                    value: true,
                    message: "收件人電話 為必填",
                  },
                  pattern: {
                    value: /^09\d{8}$/,
                    message: "電話格式不正確",
                  },
                })}
              />
              <div className="invalid-feedback">{errors?.tel?.message}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="InputAddress" className="form-label">
                收件人地址
              </label>
              <input
                type="text"
                className={`form-control ${errors.address && "is-invalid"}`}
                id="InputAddress"
                placeholder="請輸入地址"
                {...register("address", {
                  required: {
                    value: true,
                    message: "收件人地址 為必填",
                  },
                })}
              />
              <div className="invalid-feedback">{errors?.address?.message}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea id="message" cols="78" rows="7" style={{ resize: "none" }} {...register("message")}></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              送出訂單
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default OrderFrom;
