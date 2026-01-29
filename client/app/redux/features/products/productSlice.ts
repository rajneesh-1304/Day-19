import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addProduct, banProduct, deleteProduct, getProducts, unbanProduct, updateProduct } from "./productService";

interface Product {
  id: number;
  title: string;
  image?: string;
  price: number;
  description?: string;
  category: string;
  rating?: number;
}

interface ProductState {
  productData: Product[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: ProductState = {
  productData: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchProductsThunk = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit = 10,
    page = 1,
    searchValue,
    category,
    subcategory }: { limit?: number; page?: number; searchValue?: string; category?: string; subcategory?: string }, { rejectWithValue }) => {
    try {
      console.log("Hello")
      const data = await getProducts(limit, page, searchValue, category, subcategory);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addProductThunk = createAsyncThunk(
  "products/addproduct",
  async (productData, { rejectWithValue }) => {
    try {
      return await addProduct(productData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateProductThunk = createAsyncThunk<
  any,
  { id?: any; formData: any }
>(
  "products/updateproduct",
  async ({id, formData}, { rejectWithValue }) => {
    try {
      return await updateProduct(id, formData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getProductThunk = createAsyncThunk<
  any,
  { limit?: number; skip?: number; searchVal?: string; searchProd?: string }
>(
  'products',
  async ({ limit, skip, searchVal, searchProd }) => {
    try {

      return await getProducts(limit, skip, searchVal, searchProd);
    } catch (err: any) {
    }
  }
)

export const banProductThunk = createAsyncThunk(
  'products/banProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      return await banProduct(productId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to ban product'
      );
    }
  }
);

export const unbanProductThunk = createAsyncThunk(
  'products/unbanProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      return await unbanProduct(productId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to unban product'
      );
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (productId: number | string, { rejectWithValue }) => {
    try {
      return await deleteProduct(productId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.productData = [];
      state.total = 0;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action: PayloadAction<{ data: Product[]; total: number }>) => {
        state.loading = false;
        state.productData = action.payload.data;
        console.log('action', action.payload.data)
        state.total = action.payload.total;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(addProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.productData.push(action.payload);
        state.total += 1;
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add product";
      })
      .addCase(getProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.productData.push(action.payload);
      })
      .addCase(getProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to Fetch product";
      })
      .addCase(banProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banProductThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.productData = state.productData.map(product =>
          product.id === action.payload.id
            ? { ...product, is_banned: !action.payload.isActive }
            : product
        );
      })
      .addCase(banProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(unbanProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbanProductThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.productData = state.productData.map(product =>
          product.id === action.payload.id
            ? { ...product, is_banned: !action.payload.isActive }
            : product
        );
      })
      .addCase(unbanProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;