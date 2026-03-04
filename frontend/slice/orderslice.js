import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js"; // ton axiosInstance avec interceptors

// Récupérer les commandes de l'utilisateur connecté
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📦 [fetchUserOrders] Fetching user orders...");
      const response = await api.get("/api/orders/my-orders");
      console.log("✅ [fetchUserOrders] Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [fetchUserOrders] Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// Récupérer les détails d'une commande
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log("📦 [fetchOrderDetails] Fetching order:", orderId);
      const response = await api.get(`/api/orders/${orderId}`);
      console.log("✅ [fetchOrderDetails] Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [fetchOrderDetails] Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch order details" });
    }
  }
);

// Créer une nouvelle commande
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log("📦 [createOrder] Payload envoyé:", orderData);
      const response = await api.post("/api/orders", orderData);
      console.log("✅ [createOrder] Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [createOrder] Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Failed to create order" });
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderDetails: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetOrderState: (state) => {
      state.orders = [];
      state.orderDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // fetchOrderDetails
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
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders.push(action.payload); // ajoute la nouvelle commande
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create order";
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
