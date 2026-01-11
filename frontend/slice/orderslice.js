import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//async thunk to fetch user order

export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async(_, { rejectedWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            )
            return response.data;
        } catch (error) {
         return rejectedWithValue(error.response.data)   
        }
    }
)

//async thunk to fecth ordres details by id

export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails",
    async (orderID, { rejectedWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderID}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            rejectedWithValue(error.response.data);   
        }
    }
)

    const orderSlice = createSlice({
        name: "orders",
        initialState: {
            orders: [],
            totalOrders: 0,
            orderDetails: null,
            loading: false,
            error: null,
        },
        reducers: {},
        extraReducers: (builder) => {
            builder
            // fetch user orders 
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetch order details 
             .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

        }
    })

export default orderSlice.reducer;