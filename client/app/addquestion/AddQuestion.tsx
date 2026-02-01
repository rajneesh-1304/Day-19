"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { createQuestionThunk } from "@/app/redux/features/questions/questionSlice";
import { Box, Button, FormControl, MenuItem, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import { Autocomplete, Chip } from "@mui/material";
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
import { fetchTagsThunk } from "../redux/features/tags/tagSlice";

type AddQuestionModalProps = {
  onClose: () => void;
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};


const questionSchema = z.object({
  title: z.string().trim().min(20, "Title must be at least 55 characters").max(55, "Title can be 55 characters"),
  description: z
    .string()
    .refine(
      (val) => stripHtml(val).length >= 50,
      "Description must be at least 50 characters"
    )
    .refine(
      (val) => stripHtml(val).length <= 2000,
      "Description max 2000 characters"
    ),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  type: z.string().trim().min(2, "Type must be at least 2 characters"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function AddQuestion({ onClose }: AddQuestionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.users.currentUser);
  const rteRef = useRef<RichTextEditorRef>(null);
  const tag = useSelector((state: any) => state.tags.tags);
  console.log(tag, 'i am tags');

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
    defaultValues: { title: "", description: "", tags: [], type: "" },
  });

  const tagsFetch = async () => {
    await dispatch(fetchTagsThunk());
  }

  useEffect(() => {
    tagsFetch();
  }, [])

  const onSubmit = async (data: QuestionFormData) => {
    if (!user) return;

    const payload = {
      title: data.title,
      description: data.description,
      tags: data.tags,
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


            <Controller
              name="tags"
              control={control}
              render={({ field, fieldState }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={tag.map((t: any) => t.name)}
                  value={field.value || []}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Select or type tags"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      size="small"
                    />
                  )}
                />
              )}
            />


            <FormControl variant="standard" fullWidth>
              <TextField
                select
                label="Type"
                {...register("type")}
                error={!!errors.type}
                helperText={errors.type?.message}
                size="small"
              >
                <MenuItem value="PUBLIC">PUBLIC</MenuItem>
                <MenuItem value="DRAFT">DRAFT</MenuItem>
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
