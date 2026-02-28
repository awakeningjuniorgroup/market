import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js";

// fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/orders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// update order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/orders/${id}`, { status });
      return response.data; // ✅ backend renvoie l’ordre complet
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update order" });
    }
  }
);

// delete an order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/admin/orders/${id}`);
      return response.data.id; // ✅ backend renvoie { message, id }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete order" });
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        const orders = Array.isArray(action.payload.orders)
          ? action.payload.orders
          : [];
        state.orders = orders;
        state.totalOrders = orders.length;
        state.totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex((order) => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder; // ✅ remplace la commande
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update order";
      })

      // delete order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload);
        state.totalOrders = state.orders.length;
        state.totalSales = state.orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete order";
      });
  },
});

export default adminOrderSlice.reducer;
