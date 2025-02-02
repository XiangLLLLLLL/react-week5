import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
function ProductModal({ modalState, setModalState, selectProduct }) {
  // modal
  const productModalRef = useRef(null);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });
  }, [modalState]);
  useEffect(() => {
    if (modalState) {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
    }
  }, [modalState]);

  const handleCloseModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setModalState(false);
  };

  return (
    <>
      <div className="modal fade" ref={productModalRef} style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                產品詳細資料
              </h1>
              <button type="button" onClick={handleCloseModal} className="btn-close"></button>
            </div>
            <div className="modal-body">
              <div className="card">
                <img src={selectProduct?.imageUrl} className="card-img-top object-fit-cover" style={{ height: "300px" }} />
                <div className="card-body">
                  <h5 className="">產品名稱:{selectProduct?.title}</h5>
                  <h5 className="">產品種類:{selectProduct?.category}</h5>
                  <h5 className="">
                    <del>原價: {selectProduct?.origin_price}</del> / 特價:{selectProduct?.price}
                  </h5>
                  <h5 className="">產品描述:</h5>
                  <p className="card-text">{selectProduct?.description}</p>
                </div>
                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductModal;
