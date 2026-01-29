"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { addProductThunk } from "@/app/redux/features/products/productSlice";
import { Box, Button, FormControl, Snackbar, TextField } from "@mui/material";
import "./addquestion.css";
import { useState } from "react";

type AddProductModalProps = {
  onClose: () => void;
};

const questionSchema = z.object({
  title: z.string().min(15, "Title must be at least 15 characters"),
  description: z.string().min(100, "Description must be at least 100 characters"),
  tag: z.string(),
  type: z.string().min(2, "type must be at least 2 characters"),
});

type ProductFormData = z.infer<typeof questionSchema>;

export default function AddQuestion({ onClose }: AddProductModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const user = useSelector((state: RootState) => state.users.currentUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ProductFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
    },
  });

  const onSubmit = async (formData: ProductFormData) => {
    if (!user) return;
    
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("tag", formData.tag.toString());
    formDataToSend.append("type", formData.type);
    formDataToSend.append("sellerId", String(user.id));

    try {
      await dispatch(addProductThunk(formDataToSend as any)).unwrap();
      setSnackbarMessage("Product added successfully!");
      setSnackbarOpen(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      setSnackbarMessage(error.message || "Error in adding product");
      setSnackbarOpen(true);
    }
    reset();
  };


  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };


  return (
    <div className="modal_overlay">
      <div className="modal">
        <h2>Add Question</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="modal_form">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 350,
              gap: 0.75,
            }}
          >
            <FormControl variant="standard">
              <TextField
                label="Title"
                variant="outlined"
                size="small"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <TextField
                label="Description"
                variant="outlined"
                size="small"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <TextField
                label="Tag"
                type="number"
                size="small"
                variant="outlined"
                {...register("tag", { valueAsNumber: true })}
                error={!!errors.tag}
                helperText={errors.tag?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <TextField
                label="Type"
                variant="outlined"
                size="small"
                {...register("type")}
                error={!!errors.type}
                helperText={errors.type?.message}
              />
            </FormControl>

            <div className="modal_actions">
              <Button variant="contained" sx={{ mt: 1, width: 200 }} type="submit">
                Save
              </Button>
              <Button variant="contained" sx={{ mt: 1, width: 200 }} type="submit">
                Draft
              </Button>
              <Button
                variant="outlined"
                sx={{ mt: 1, width: 200 }}
                onClick={() => onClose()}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </form>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMessage}
      />
    </div>
  );
}
