import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import girl from "../img/girl2.jpg"

export default function CreateBeutyshop() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  console.log(formData);

  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: [downloadURL] }); // Note the array brackets
        });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8088/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        alert("success");
        navigate(``);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
   
    <div className="bg-[#d9d9da] relative ">


   

<img src={girl} alt="" className="w-full h-[700px] opacity-95 object-cover " />


<div className="absolute transform -translate-x-0 translate-y-0 top-1  ml-6 ">


      <h1 className="text-center text-3xl ml-10 font-serif  mt-9">Create Post</h1>
      <div className="flex justify-center items-center">

     
      <form className="flex flex-col gap-4 w-[600px]   rounded-lg   bg-gray-50 bg-opacity-30 border  mb-10 mt-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 ">
          <div className="flex gap-4 items-center justify-between border-none p-3">
          <label htmlFor="uploadInput" className="bg-white bg-opacity-90 w-48 h-20 hover:bg-[#d9d9da] border rounded-xl cursor-pointer">
            <div className="mt-5">
            <span className="text-2xl  ml-16 text-gray-700 font-medium text-opacity-50 ">Photo</span>
            </div>
     
      <input
        id="uploadInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setFile(e.target.files[0])}
      />
    </label>
    <button
      type="button"
      className="w-28 h-8 font-medium text-sm hover:opacity-80 rounded-lg bg-gradient-to-r from-slate-500 to-blue-white border
        
       text-white"
      size="sm"
      onClick={handleUpdloadImage}
      disabled={imageUploadProgress}
    >
      {imageUploadProgress ? (
        <div className="w-16 h-16">
          <CircularProgressbar
            value={imageUploadProgress}
            text={`${imageUploadProgress || 0}%`}
          />
        </div>
      ) : (
        "Upload Image"
      )}
    </button>
          </div>
        </div>
        <div className="flex justify-center items-center">
        <input
          className=" bg-white bg-opacity-90 border-none  h-10 rounded-md w-[450px] text-slate-800"
          type="text"
          placeholder=" Title"
          required
          id="title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        </div>
        

        {imageUploadError && (
          <p className="mt-5 text-red-600   h-7 rounded-lg text-center ">
            {imageUploadError}
          </p>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-56 h-20 object-cover"
          />
        )}

        <div className="flex gap-4">
          <textarea
            type="text"
            placeholder="Content"
            required
            id="content"
            maxLength={100}
            className="bg-white bg-opacity-90 border-none rounded-md w-[400px] ml-[100px] text-slate-800 h-48"
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
           <div className="flex justify-center items-center mb-11">
           <button
          type="submit"
          className=" w-[200px] font-medium text-white  h-10 bg-gradient-to-r from-slate-500 to-blue-white border hover:opacity-80 hover:text-white rounded-lg"
        >
          Post
        </button>

           </div>
        

        {publishError && (
          <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center ">
            {publishError}
          </p>
        )}
      </form>
      </div>

  </div>
    </div>
   
  );
}



