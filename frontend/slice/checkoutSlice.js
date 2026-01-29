import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js"; // ton axiosInstance avec interceptors

// Créer un checkout (utilisateur connecté)
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

// Créer un checkout invité
export const createGuestCheckout = createAsyncThunk(
  "checkout/createGuestCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await api.post("/checkout/guest", checkoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Guest checkout failed" });
    }
  }
);

// Finaliser un checkout
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/checkout/${checkoutId}/finalize`);
      return response.data; // ⚠️ backend renvoie finalOrder
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
    order: null,       // ✅ ajout pour stocker la commande finale
    loading: false,
    error: null,
    paymentUrl: null,
    success: false,
    invoice: null,
  },
  reducers: {
    resetCheckoutState: (state) => {
      state.checkout = null;
      state.order = null;
      state.loading = false;
      state.error = null;
      state.paymentUrl = null;
      state.success = false;
      state.invoice = null;
    },
  },
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

      // createGuestCheckout
      .addCase(createGuestCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuestCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createGuestCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Guest checkout failed";
      })

      // finalizeCheckout
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload; // ✅ stocke la commande finale
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Finalize failed";
      })

      // initiateOrangeMoneyPayment
      .addCase(initiateOrangeMoneyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateOrangeMoneyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.payment_url;
      })
      .addCase(initiateOrangeMoneyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Orange Money payment failed";
      })

      // createInvoice
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

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
