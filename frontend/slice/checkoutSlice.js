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
// Créer une facture (paiement à la livraison)
export const createInvoice = createAsyncThunk(
  "checkout/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await api.post("/invoices", invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Invoice failed" });
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
    invoice: null, // ✅ nouvelle propriété
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
      })

      // ✅ createInvoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Invoice failed";
      });
  },
});


export default checkoutSlice.reducer;
