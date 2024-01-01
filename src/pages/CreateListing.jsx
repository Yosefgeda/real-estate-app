import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFile] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
  });
  const [imapgeUploadErr, setImageUploadErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  // console.log(formData);
  const handleImageUpload = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setLoading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadErr(false);
          setLoading(false);
        })
        .catch((error) => {
          setImageUploadErr("You can upload 6 images per listing");
          setLoading(false);
        });
    } else {
      setImageUploadErr("House number not met");
      setLoading(false)
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = Date.now() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index)
    })
  }
  const handleChange = (e) => {
    if(e.target.id === 'sell' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.imageUrls.length < 1) return setError('Please upload at least one image');
      if(formData.discountedPrice > formData.regularPrice) return setError('Discounted price cannot be greater than regular price');
      setLoad(true);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._doc._id
        })
      });
      const data = await res.json();
      setLoad(false);
      if(data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch(error) {
      setError(error.message);
      setLoad(false);
    }

  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border-2 border-gray-300 p-2 rounded-lg w-full"
            id="name"
            maxLength="62"
            minLength="3"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border-2 border-gray-300 p-2 rounded-lg w-full"
            id="description"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border-2 border-gray-300 p-2 rounded-lg w-full"
            id="address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="sell" 
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'sell'}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="rent" 
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="parking" 
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="furnished" 
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="offer" 
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
                />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg w-1/4"
                type="number"
                id="bedrooms"
                min="1"
                onChange={handleChange}
                value={formData.bedrooms}
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg w-1/4"
                type="number"
                id="bathrooms"
                min="1"
                onChange={handleChange}
                value={formData.bathrooms}
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg w-1/4"
                type="number"
                id="regularPrice"
                min="50"
                onChange={handleChange}
                value={formData.regularPrice}
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <p className="text-xs">( $ / month )</p>
              </div>
            </div>
            {formData.offer && 
              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-1/4"
                  type="number"
                  id="discountedPrice"
                  min="0"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <p className="text-xs">( $ / month )</p>
                </div>
              </div>
            }
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-grey-700">
              {" "}
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFile(e.target.files)}
              className="p-3 border border-grey-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg"
            >
              {loading ? "LOADING..." : "UPLOAD"}
            </button>
          </div>
          <p className="text-red-500 text-sm">
            {imapgeUploadErr && imapgeUploadErr}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((urls, index) => (
              <div key={index} className="flex justify-between p-3">
                <img
                  src={urls}
                  alt="Listing Image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-500 hover:opacity-75">
                  DELETE
                </button>
              </div>
            ))}
          <button disabled={load || loading} className="bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95">
            {load ? "CREATING.." : "CREATE LISTING"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
