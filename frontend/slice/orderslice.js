import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance"; // ✅ utilise ton axiosInstance configuré

// fetch user orders
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/orders/my-orders");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// fetch order details by id
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderID, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/orders/${orderID}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch order details" });
    }
  }
);

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
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch order details";
      });
  },
});

export default orderSlice.reducer;
