import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js";

// Créer un checkout (utilisateur connecté)
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

// Créer un checkout invité
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

// Finaliser un checkout → Order
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/orders/${checkoutId}/finalize`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to finalize checkout" });
    }
  }
);

// Paiement Orange Money
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

// Récupérer les checkouts utilisateur
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

// Récupérer détails d’un checkout
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

export const fetchCheckoutById = createAsyncThunk(
  "checkout/fetchCheckoutById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/checkout/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch checkout" });
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
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.checkouts.push(action.payload);
      })
      .addCase(createGuestCheckout.fulfilled, (state, action) => {
        state.checkouts.push(action.payload);
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.checkouts.push(action.payload);
      })
      .addCase(initiateOrangeMoneyPayment.fulfilled, (state, action) => {
        state.checkoutDetails = action.payload;
      })
      .addCase(fetchUserCheckouts.fulfilled, (state, action) => {
        state.checkouts = action.payload;
      })
      .addCase(fetchCheckoutDetails.fulfilled, (state, action) => {
        state.checkoutDetails = action.payload;
      })
     .addCase(fetchCheckoutById.pending, (state) => { 
       state.loading = true; state.error = null; }) 
      .addCase(fetchCheckoutById.fulfilled, (state, action) => { 
        state.loading = false; state.checkout = action.payload;
      })
    .addCase(fetchCheckoutById.rejected, (state, action) => { 
    state.loading = false; state.error = action.payload?.message || "Failed to fetch checkout"; });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
