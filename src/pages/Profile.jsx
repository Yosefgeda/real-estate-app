import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((store) => store.user);
  const inputReference = useRef(null); //references the <input 'type file' > to the picture. i.e when the picture is clicked the file chooser is opened
  const [image, setImage] = useState(undefined);
  const [load, setLoad] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdaateSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleImageUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    //  Loading progress for upload picture

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setLoad(Math.round(progress));
      (error) => {
        setImageError(true);
      };
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({
            ...formData,
            profilePicture: downloadUrl,
          });
        });
      };
    });
  };
  
  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data));
      }
      dispatch(updateUserSuccess(data));
      setUpdaateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err));
    }
  };

  const handleDeleteAccount = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
       
      });
      const data = await res.json();
      console.log(res)
      if(data.success === false) {
        dispatch(deleteUserFailure(data))
      };
      dispatch(deleteUserSuccess(data))
    } catch (err) {
      dispatch(deleteUserFailure(err))
    }
  };

  const handleSignout = async() => {
    try {
      await fetch('/app/auth/signout');
      dispatch(signOut());
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={inputReference}
          className="hidden"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          className="h-24 w-24 rounded-full cursor-pointer object-cover self-center mt-3"
          onClick={() => inputReference.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : load > 0 && load < 100 ? (
            <span className="text-slate-700">{`Uploading: ${load} %`}</span>
          ) : load === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95">
          {loading ? "Loading.." : "UPDATE"}
        </button>
        <Link to={"/create-listing"} className="bg-green-700 text-white text-center p-3 rounded-lg hover:opacity-95">
          CREATE LISTING
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteAccount}
          className="text-red-600 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-600 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong"}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "Update Successful"}
      </p>
    </div>
  );
};

export default Profile;
