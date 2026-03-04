import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// --- CREATE ORDER ---
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log("📦 [createOrder] Sending orderData:", orderData);
      const { data } = await api.post("/api/orders", orderData);
      console.log("✅ [createOrder] Response data:", data);
      return data;
    } catch (error) {
      console.error("❌ [createOrder] Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Failed to create order" });
    }
  }
);

// --- FETCH USER ORDERS ---
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📦 [fetchUserOrders] Fetching user orders...");
      const { data } = await api.get("/api/orders/my-orders");
      console.log("✅ [fetchUserOrders] Response data:", data);
      return data;
    } catch (error) {
      console.error("❌ [fetchUserOrders] Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// --- FETCH ORDER DETAILS ---
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderID, { rejectWithValue }) => {
    try {
      console.log("📦 [fetchOrderDetails] Fetching details for orderID:", orderID);
      const { data } = await api.get(`/api/orders/${orderID}`);
      console.log("✅ [fetchOrderDetails] Response data:", data);
      return data;
    } catch (error) {
      console.error("❌ [fetchOrderDetails] Error:", error.response?.data || error.message);
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
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      console.log("🧹 [clearCurrentOrder] Resetting currentOrder");
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- CREATE ORDER ---
      .addCase(createOrder.pending, (state) => {
        console.log("⏳ [createOrder] Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log("✅ [createOrder] Fulfilled:", action.payload);
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
        state.totalOrders = state.orders.length;
      })
      .addCase(createOrder.rejected, (state, action) => {
        console.error("❌ [createOrder] Rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to create order";
      })

      // --- FETCH USER ORDERS ---
      .addCase(fetchUserOrders.pending, (state) => {
        console.log("⏳ [fetchUserOrders] Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        console.log("✅ [fetchUserOrders] Fulfilled:", action.payload);
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
        state.totalOrders = state.orders.length;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        console.error("❌ [fetchUserOrders] Rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // --- FETCH ORDER DETAILS ---
      .addCase(fetchOrderDetails.pending, (state) => {
        console.log("⏳ [fetchOrderDetails] Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        console.log("✅ [fetchOrderDetails] Fulfilled:", action.payload);
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        console.error("❌ [fetchOrderDetails] Rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch order details";
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
