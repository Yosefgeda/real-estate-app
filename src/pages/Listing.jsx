import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'; // npm i swiper
import SwiperCore from 'swiper'; // npm i swiper
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'; // npm i swiper;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faBed, faBath, faParking, faChair } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';


const Listing = () => {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [contact, setContact] = useState(false); 

    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try{
                setLoading(true);
                const res = await fetch(`/api/listing/getListing/${params.listingid}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                if(data.success === false) {
                    setError(data.message);
                    setLoading(false);
                    return
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch(err) {
                setError(err.message);
            }
        }
        fetchListing();
    }, [])

  return (
    <main>
        {loading && <p className='text-center mt-10 text-2xl'>Loading...</p>}
        {error && <p className='text-center mt-10 text-2xl'>{error}</p>}
        {listing && !loading && !error && 
            <div>
                <Swiper navigation>
                    {
                        listing.imageUrls.map((url) => 
                                <>
                                    <SwiperSlide key={url}>
                                        <div 
                                            key={url}
                                            className='h-[400px]' 
                                            style={{ background:`url(${url}) center no-repeat`, backgroundSize: 'cover'}}>
                                        </div>
                                    </SwiperSlide>
                                </>
                        )
                    }
                </Swiper>
                <div className='m-7 flex gap-3'>
                    <h1 className='text-2xl'>{listing.name}</h1>
                    <h1 className='text-2xl text-green-700'>${listing.regularPrice} 
                        <span>
                            {listing.type === 'rent' ? ' / month' : ''}
                        </span>
                    </h1>
                </div>

                <p className='flex items-center gap-3 ml-7 text-sm'>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className='text-green-500'/>
                    {listing.address}
                </p>
                <div className='ml-7 mt-2 flex gap-3'>
                    <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                        {listing.type === 'rent' ? 'FOR RENT' : 'FOR SELL'}
                    </p>
                    {listing.offer ? (
                        <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>${listing.regularPrice - listing.discountedPrice}</p>
                        ) : ''
                    }
                </div>
                <p className='m-7 text-slate-700'>
                    <span className='font-semibold text-black'>Description:{' '} </span>
                    {listing.description}
                </p>
                <ul className='m-7 flex gap-5 flex-wrap text-sm sm:gap-6'>
                    <li className='flex gap-1 items-center'>
                        <FontAwesomeIcon icon={faBed} className='text-green-500 text-lg'/>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms} Bedroom`}
                    </li>
                    <li className='flex gap-1 items-center'>
                        <FontAwesomeIcon icon={faBath}  className='text-green-500 text-lg'/>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bedrooms` : `${listing.bathrooms} Bedroom`}
                    </li>
                    <li className='flex gap-1 items-center'>
                        <FontAwesomeIcon icon={faParking}  className='text-green-500 text-lg'/>
                        {listing.parking ? `Parking` : `No Parking`}
                    </li>
                    <li className='flex gap-1 items-center'>
                        <FontAwesomeIcon icon={faChair}  className='text-green-500 text-lg'/>
                        {listing.furnished ? `Furnished` : `Not Furnished`}
                    </li>
                </ul>
                {currentUser && listing.userRef === currentUser._doc._id && !contact &&
                    (<div onClick={() => setContact(true)} className='text-center m-7'>
                        <button className='bg-red-500 w-full p-3 text-white rounded-lg sm:w-1/6 hover:opacity-95 md:w-1/4'>CONTACT LANDLORD</button>
                    </div>
                )}
                {contact && <Contact listing={listing} />}
            </div>
        }
    </main>
  )
}

export default Listing