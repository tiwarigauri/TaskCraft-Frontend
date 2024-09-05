import React, { useState } from "react";
// import { Formik, Form, Field } from "formik";
import {
  TextField,
  Button,
  Grid,
  Modal,
  Box,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
// import { DatePicker } from "@mui/lab";
import * as Yup from "yup";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { createNewTask } from "../../../ReduxToolkit/TaskSlice";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  image: Yup.string()
    .url("Please enter a valid URL")
    .required("Image URL is required"),
  description: Yup.string().required("Description is required"),
  deadline: Yup.date().required("Deadline is required"),
});

const tags = ["Angular", "React", "Vuejs", "Spring Boot", "Node js", "Python"];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  outline: "none",
  p: 4,
  boxShadow: "rgba(215, 106, 255, 0.507) 0px 0px 100px",
};

const CreateTaskForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const [selectedTags, setSelectedTags] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    tags: [],
    deadline: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagsChange = (event, value) => {
    setSelectedTags(value);
  };

  const formatDate = (input) => {
    if (!input || isNaN(input.$d)) return null; // Return null if the date is invalid or not selected
  
    let {
      $y: year,
      $M: month,
      $D: day,
      $H: hours,
      $m: minutes,
      $s: seconds,
      $ms: milliseconds,
    } = input;
  
    const date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
  
    if (isNaN(date.getTime())) return null; // Further check if the constructed date is valid
  
    return date.toISOString();
  };
  

  const handleDeadlineChange = (date) => {
    setFormData({
      ...formData,
      deadline: date && !isNaN(date.$d) ? date : null,
    });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const { deadline } = formData;
    
    const formattedDeadline = deadline ? formatDate(deadline) : null;
    
    formData.deadline = formattedDeadline;
    formData.tags = selectedTags;
  
    if (!formattedDeadline) {
      console.warn("Deadline is invalid or not selected.");
    }
    
    dispatch(createNewTask(formData));
    console.log("Form data:", formData);
    handleClose();
  };
  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                fullWidth
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="multiple-limit-tags"
                options={tags}
                onChange={handleTagsChange}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Tags" placeholder="Favorites" />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="w-full"
                  label="Deadline"
                  //value={formData.deadline}
                  onChange={handleDeadlineChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                sx={{ padding: ".8rem" }}
                fullWidth
                className="customeButton"
                variant="contained"
                type="submit"
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateTaskForm;
