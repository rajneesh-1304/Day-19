"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { createQuestionThunk } from "@/app/redux/features/questions/questionSlice";
import { Box, Button, FormControl, MenuItem, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import { useRef } from "react";
import "./addquestion.css";

type AddQuestionModalProps = {
  onClose: () => void;
};

const questionSchema = z.object({
  title: z.string().trim().min(20, "Title must be at least 55 characters").max(55, "Title can be 55 characters"),
  description: z.string().trim().min(50, "Description must be at least 10 characters").max(2000, "Description max 2000 characters"),
  tags: z.string().trim().min(1, "At least one tag is required"),
  type: z.string().trim().min(2, "Type must be at least 2 characters"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function AddQuestion({ onClose }: AddQuestionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.users.currentUser);
  const rteRef = useRef<RichTextEditorRef>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: { title: "", description: "", tags: "", type: "" },
  });

  const onSubmit = async (data: QuestionFormData) => {
    if (!user) return;

    const payload = {
      title: data.title,
      description: data.description,
      tags: data.tags.split(",").map((t) => t.trim()),
      type: data.type,
      userId: user.id,
    };

    try {
      await dispatch(createQuestionThunk(payload)).unwrap();
      setSnackbarMessage("Question added successfully!");
      setSnackbarOpen(true);
      setTimeout(onClose, 1000);
      reset();
    } catch (error: any) {
      setSnackbarMessage(error.message || "Error adding question");
      setSnackbarOpen(true);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <div className="modal_overlay">
      <div className="modal">
        <h2>Add Question</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", width: 350, gap: 1 }}>
            <FormControl variant="standard">
              <TextField
                label="Title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
                size="small"
              />
            </FormControl>

            {/* <FormControl variant="standard">
              <TextField
                label="Description"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                size="small"
                multiline
                rows={4}
              />
            </FormControl> */}

            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <RichTextEditor
                  sx={{
                    mt: 2,
                    mb: 2,
                    border: error ? "1px solid red" : "inherit"
                  }}
                  immediatelyRender={false}
                  extensions={[StarterKit]}
                  content={value || "<p></p>"}
                  onUpdate={({ editor }) => onChange(editor.getHTML())}
                  renderControls={() => (
                    <MenuControlsContainer>
                      <MenuSelectHeading />
                      <MenuDivider />
                      <MenuButtonBold />
                      <MenuButtonItalic />
                    </MenuControlsContainer>
                  )}
                />
              )}
            />


            <FormControl variant="standard">
              <TextField
                label="Tags (comma separated)"
                {...register("tags")}
                error={!!errors.tags}
                helperText={errors.tags?.message}
                size="small"
              />
            </FormControl>

            <FormControl variant="standard" fullWidth>
              <TextField
                select
                label="Type"
                {...register("type")}
                error={!!errors.type}
                helperText={errors.type?.message}
                size="small"
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </TextField>
            </FormControl>


            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button variant="contained" type="submit" sx={{ flex: 1 }}>
                Save
              </Button>
              <Button variant="outlined" onClick={onClose} sx={{ flex: 1 }}>
                Cancel
              </Button>
            </Box>
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
