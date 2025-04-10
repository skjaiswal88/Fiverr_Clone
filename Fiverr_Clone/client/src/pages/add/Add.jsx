import React, { useReducer, useState, useEffect } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  // ✅ Log form state live as it updates
  useEffect(() => {
    console.log("Current form state:", state);
  }, [state]);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );

      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log("Upload error:", err);
      setUploading(false);
    }
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => newRequest.post("/gigs", gig),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />

            <label>Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>

            <div className="images">
              <div className="imagesInputs">
                <label>Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label>Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <label>Description</label>
            <textarea
              name="desc"
              placeholder="Brief descriptions to introduce your service to customers"
              rows="16"
              onChange={handleChange}
            ></textarea>

            <button onClick={handleSubmit}>Create</button>
          </div>

          <div className="details">
            <label>Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />

            <label>Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              placeholder="Short description of your service"
              rows="10"
            ></textarea>

            <label>Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />

            <label>Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />

            <label>Add Features</label>
            <form className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">Add</button>
            </form>

            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f} <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label>Price</label>
            <input type="number" onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
