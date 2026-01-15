import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js"; // ton axiosInstance avec interceptors

// Créer un checkout
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await api.post("/checkout", checkoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Checkout failed" });
    }
  }
);

// Finaliser un checkout
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/checkout/${checkoutId}/finalize`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Finalize failed" });
    }
  }
);

// Initier un paiement Orange Money
export const initiateOrangeMoneyPayment = createAsyncThunk(
  "checkout/initiateOrangeMoneyPayment",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await api.post("/orange-money/initiate-payment", { amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Orange Money payment failed" });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
    paymentUrl: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createCheckout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Checkout failed";
      })

      // finalizeCheckout
      .addCase(finalizeCheckout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Finalize failed";
      })

      // initiateOrangeMoneyPayment
      .addCase(initiateOrangeMoneyPayment.fulfilled, (state, action) => {
        state.paymentUrl = action.payload.payment_url;
      })
      .addCase(initiateOrangeMoneyPayment.rejected, (state, action) => {
        state.error = action.payload?.message || "Orange Money payment failed";
      });
  },
});

export default checkoutSlice.reducer;
