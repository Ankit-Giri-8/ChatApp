import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {

    const {authUser, updateProfile} = useContext(AuthContext)

    const [selectedImage,setSelectedImage] = useState(null)
    const navigate = useNavigate()
    const [name,setName] = useState(authUser.fullName)
    const [bio, setBio] = useState(authUser.bio);

    const handleSubmit = async(e) => {
      e.preventDefault();
      if(!selectedImage){
        await updateProfile({fullName: name, bio})
        navigate("/");
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(selectedImage)
      reader.onload = async()=>{
        const base64Image = reader.result
        await updateProfile({profilePic: base64Image, fullName: name, bio });
        navigate("/");
      }
    }

    // Handler to remove profile picture
    const handleRemoveProfilePic = async () => {
      await updateProfile({ profilePic: "", fullName: name, bio });
      setSelectedImage(null);
    };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between rounded-lg max-sm:flex-col-reverse">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : authUser.profilePic || assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${selectedImage && "rounded-full"} rounded-full`}
            />
            <span>Upload Profile Image</span>
            {authUser.profilePic !== assets.avatar_icon && authUser.profilePic !== "" && (
              <button 
                type="submit"
                onClick={handleRemoveProfilePic}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs rounded-full shadow hover:scale-105 hover:from-red-600 hover:to-pink-600 transition-all duration-200 focus:outline-none"
                style={{ marginLeft: 4 }}
              >
                <span role="img" aria-label="Remove">
                  🗑️
                </span>
                Remove
              </button>
            )}
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            required
            placeholder="Write profile bio..."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-md cursor-pointer"
          >
            Save
          </button>
        </form>

        <img
          src={authUser.profilePic || assets.avatar_icon}
          alt=""
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${
            selectedImage && "rounded-full"
          }`}
        />
      </div>
    </div>
  );
}

export default ProfilePage