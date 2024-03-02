import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { clearMessage } from '../../store/slices/messageSlice'
import { login } from '../../store/slices/authSlice'
import Button from '../../components/Button/button';
import { setMessage } from '../../store/slices/messageSlice';


function LogInPage() {
    const [forgotpassword, setforgotpassword] = useState(false);
    const { loading } = useSelector((state) => state.loading);
    const [showPassword, setShowPassword] = useState(false);

    let forgotpassword_handler = (e) => {
        setforgotpassword(!forgotpassword);
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [input, setInput] = useState({});

    const onChangeHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        })
    }

    const logInHandler = (e) => {
        e.preventDefault();
        let flag = '';
        if (input?.email?.length < 7) {
            flag = 'Email';
        }
        if (input?.password?.length < 7) {
            flag = 'Password';
        }
        if (flag !== '') {
            dispatch(setMessage(flag + ' must be 6 characters long!'))
            setTimeout(() => {
                dispatch(clearMessage());
            }, 2000)
            flag = '';
            return;
        }

        dispatch(login(input))
    }

    const send_email_handler = (e) => {
        e.preventDefault();
        dispatch(setMessage('Not implemented!!!'))
        setTimeout(() => {
            dispatch(clearMessage());
        }, 2000)
    }

    return (
        <>
            <div className='w-full flex flex-col py-14 relative'>
                <form className='flex flex-col justify-between gap-4' >
                    <p className='text-4xl font-extrabold font-sans'>Log In</p>
                    <input
                        className='border-[1px] bg-transparent rounded-sm h-10 p-2 border-black w-full '
                        placeholder="Email"
                        type="email"
                        name="email"
                        required
                        onChange={onChangeHandler}
                    />
                    <div className='relative flex  flex-col justify-center'>
                        <input
                            onChange={onChangeHandler}
                            name="password"
                            required
                            autoComplete="off"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className='border-[1px] bg-transparent rounded-sm h-10 p-2 pr-8 border-black w-full '
                        ></input>
                        <FontAwesomeIcon className='absolute right-2' onClick={() => { setShowPassword(!showPassword) }} icon={showPassword ? faEye : faEyeSlash} />
                    </div>

                    <div className='flex justify-between items-center'>
                        {loading ? <Button className='text-white bg-black px-4 py-2 min-w-24' label={<FontAwesomeIcon icon={faSpinner} spinPulse />} /> : <Button className='text-white bg-black px-4 py-2 border border-1 hover:border-black hover:bg-white hover:text-black' onClick={logInHandler} label='Log In' />}
                        <a className='cursor-pointer hover:text-green-500' onClick={forgotpassword_handler}>Reset password?</a>
                    </div>
                </form>
                {forgotpassword && (
                    <form className='bg-white absolute top-0 left-0 bottom-0 right-0 flex flex-col z-10'>
                        <div className='w-full p-6'>
                            <p className='my-5 text-2xl'>Reset password</p>
                            <input
                                placeholder="Email"
                                type="email"
                                name="Email"
                                autoComplete="off"
                                required
                                className='border-[1px] bg-transparent rounded-sm h-10 p-2 border-black w-full '
                            />
                            <div className='flex justify-between mt-6'>
                                <Button className='text-white bg-black px-4 py-2 border border-1 hover:border-black hover:bg-white hover:text-black' onClick={forgotpassword_handler} label='Cancel' />
                                <Button className='text-white bg-black px-4 py-2 border border-1 hover:border-black hover:bg-white hover:text-black' label='Send Email' onClick={send_email_handler} />
                            </div>
                        </div >
                    </form >
                )}
            </div >
        </>
    );
}

export default LogInPage;