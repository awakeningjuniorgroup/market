import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance"; // ✅ utilise ton axiosInstance configuré

// --- CREATE ORDER ---
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/orders", orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to create order" });
    }
  }
);

// --- FETCH USER ORDERS ---
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

// --- FETCH ORDER DETAILS ---
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
    currentOrder: null, // ✅ nouvelle commande créée
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- CREATE ORDER ---
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload; // ✅ stocke la commande créée
        state.orders.push(action.payload);   // ✅ ajoute à la liste
        state.totalOrders = state.orders.length;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create order";
      })

      // --- FETCH USER ORDERS ---
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
        state.totalOrders = state.orders.length;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // --- FETCH ORDER DETAILS ---
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

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
