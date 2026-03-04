import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js";

// Créer une commande
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
        state.error = action.payload?.message || "Checkout failed";
      })
      .addCase(fetchUserCheckouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCheckouts.fulfilled, (state, action) => {
        state.loading = false;
        state.checkouts = action.payload;
      })
      .addCase(fetchUserCheckouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch checkouts";
      })
    .addCase(fetchCheckoutDetails.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchCheckoutDetails.fulfilled, (state, action) => {
  state.loading = false;
  state.checkoutDetails = action.payload;
})
.addCase(fetchCheckoutDetails.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message || "Failed to fetch checkout details";
});

  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
