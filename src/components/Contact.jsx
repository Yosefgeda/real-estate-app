import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  // console.log(listing)
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setLandlord(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="m-7 flex flex-col items-start gap-3">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>{" "}
          </p>
          <textarea
            className="mt-4 w-full h-40 border-2 border-gray-300 rounded-md p-2 sm:w-1/2"
            placeholder="Message"
            id="message"
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white p-2 rounded-md w-1/2 text-center hover:opacity-95"
          >
            {" "}
            SEND MESSAGE
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
