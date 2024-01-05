import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'; // npm i swiper
import SwiperCore from 'swiper'; // npm i swiper
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'; // npm i swiper

const Listing = () => {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const params = useParams();

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
                console.log(data);
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
            <>
                <Swiper navigation>
                    {
                        listing.imageUrls.map((url) => {
                            return (<SwiperSlide key={url}>
                                <div 
                                className='h-[500px]' 
                                style={{ background:`url(${url}) center no-repeat`, backgroundSize: 'cover'}}>
                                </div>
                            </SwiperSlide>)
                        })
                    }
                </Swiper>
            </>
        }
    </main>
  )
}

export default Listing