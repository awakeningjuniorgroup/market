import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js";

// fetch all products (admin only)
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/products");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch products" });
    }
  }
);

// create product
export const createProduct = createAsyncThunk(
  "adminProducts/create",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/admin/products", productData);
      return data.product || data; // selon ce que renvoie ton backend
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to create product" });
    }
  }
);

// update product
export const updateProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/products/${id}`, productData);
      return data.product || data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update product" });
    }
  }
);

// delete product
export const deleteProduct = createAsyncThunk(
  "adminProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to delete product" });
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })

      // create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to create product";
      })

      // update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update product";
      })

      // delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete product";
      });
  },
});

export default adminProductSlice.reducer;
