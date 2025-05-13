// validations/ProductValidation.js
import * as yup from "yup";

export const productSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  startingPrice: yup.number().positive().required("Starting price required"),
  imageUrl: yup.string().notRequired(),
  endTime: yup.string().required("End time is required"),
});
