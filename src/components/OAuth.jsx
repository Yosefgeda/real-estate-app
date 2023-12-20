import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import {app} from '../firebase';
import {useDispatch} from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
    const dispatch = useDispatch()
    const handleClick = async () => {
        try {
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })
            const data = await res.json();
            dispatch(signInSuccess(data))
        } catch(error) {
            console.log("Failed operation", error)
        }
    }
  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-red-700 p-3 rounded-lg hover:opacity-95 uppercase"
    >
      Continue With Google
    </button>
  );
};

export default OAuth;