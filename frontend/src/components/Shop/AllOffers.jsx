import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { deleteOffer, getAllOffersShop } from "../../redux/actions/offer";

const AllOffers = () => {
  const { products, isLoading } = useSelector((state) => state.offers);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOffersShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteOffer(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        return (
          <>
            <Link to="/offers">
              <Button>
                <AiOutlineEye
                  size={20}
                  className="flex justify-center items-center rounded-full w-8 h-8 py-2 text-blue-700 font-semibold hover:scale-125 duration-300"
                />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center">
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete
                size={20}
                className="bg-red-500 flex justify-center items-center rounded-full w-8 h-8 py-2 text-white font-semibold hover:bg-white hover:text-red-500 hover:scale-125 duration-300"
              />
            </Button>
          </div>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "Nrs " + item.discountPrice,
        Stock: item.stock,
        sold: 40,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllOffers;
