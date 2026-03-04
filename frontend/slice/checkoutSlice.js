import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js";

// Créer une commande pour utilisateur connecté
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/checkout", checkoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Checkout failed" });
    }
  }
);

// Créer une commande pour invité
export const createGuestCheckout = createAsyncThunk(
  "checkout/createGuestCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/checkout/guest", checkoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Guest checkout failed" });
    }
  }
);

// Finaliser un checkout (si tu veux changer son statut en commande validée)
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/checkout/${checkoutId}/finalize`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to finalize checkout" });
    }
  }
);

// Paiement via Orange Money
export const initiateOrangeMoneyPayment = createAsyncThunk(
  "checkout/initiateOrangeMoneyPayment",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/checkout/${checkoutId}/orange-money`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Orange Money payment failed" });
    }
  }
);

// Récupérer les commandes de l'utilisateur
export const fetchUserCheckouts = createAsyncThunk(
  "checkout/fetchUserCheckouts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/checkout/my-checkouts");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch checkouts" });
    }
  }
);

// Récupérer les détails d’un checkout
export const fetchCheckoutDetails = createAsyncThunk(
  "checkout/fetchCheckoutDetails",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/checkout/${checkoutId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch checkout details" });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkouts: [],
    checkoutDetails: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetCheckoutState: (state) => {
      state.checkouts = [];
      state.checkoutDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
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
        state.success = true;
        state.checkouts.push(action.payload);
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // createGuestCheckout
      .addCase(createGuestCheckout.fulfilled, (state, action) => {
        state.checkouts.push(action.payload);
      })

      // finalizeCheckout
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.checkoutDetails = action.payload;
      })

      // initiateOrangeMoneyPayment
      .addCase(initiateOrangeMoneyPayment.fulfilled, (state, action) => {
        state.checkoutDetails = action.payload;
      })

      // fetchUserCheckouts
      .addCase(fetchUserCheckouts.fulfilled, (state, action) => {
        state.checkouts = action.payload;
      })

      // fetchCheckoutDetails
      .addCase(fetchCheckoutDetails.fulfilled, (state, action) => {
        state.checkoutDetails = action.payload;
      });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
