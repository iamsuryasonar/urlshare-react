import React, { useState, useEffect } from 'react';
import s from './Login_page.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { clearMessage } from '../../store/slices/messageSlice'
import { login } from '../../store/slices/authSlice'
import Button from '../../components/Button/button';
import Message from '../../components/Message/Message'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'


function LogInPage() {
    const [forgotpassword, setforgotpassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [send_email, setSend_email] = useState(false);

    let forgotpassword_handler = (e) => {
        setforgotpassword(!forgotpassword);
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message } = useSelector((state) => state.message);

    const [input, setInput] = useState({});

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const onChangeHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        })
    }

    const logInHandler = () => {
        setLoading(true);
        dispatch(login(input))
            .unwrap()
            .then(() => {
                navigate("/user/myurls");
            })
            .catch(() => {
                setLoading(false);
            });
    }

    const send_email_handler = () => {
        setSend_email(true);
        setTimeout(() => {
            setSend_email(false);
        }, 3000);
    }


    return (
        <>
            <div className={s.wrapper} >
                <div className={s.overlaycontainer}>
                    <div className={s.container} >
                        <ul>
                            <li className={s.list_items}>
                                <input
                                    className={`${s.textsize} ${s.inputField}`}
                                    placeholder="Email"
                                    type="email"
                                    name="email"
                                    required
                                    onChange={onChangeHandler}
                                />
                            </li>
                            <li className={s.list_items}>
                                <input
                                    className={`${s.textsize} ${s.inputField}`}
                                    placeholder="Password"
                                    type="password"
                                    name="password"
                                    required
                                    onChange={onChangeHandler}
                                />
                            </li>
                            <li className={s.list_items}>
                                {loading && <Message label={'loading...'} />}
                                <div className={s.loginandforgotpassword}>
                                    <Button onClick={logInHandler} label='Log In' />
                                    <a onClick={forgotpassword_handler}>Reset password?</a>
                                </div>
                            </li>
                            {message && <Message label={message} />}
                        </ul>
                    </div >
                    {forgotpassword && (
                        <ul className={s.forgotpassword_overlay}>
                            <li className={s.list_items}>
                                <input
                                    placeholder="Email"
                                    type="email"
                                    name="Email"
                                    autocomplete="off"
                                    required
                                    className={`${s.textsize} ${s.inputField}`}
                                />
                                <div className={s.overlaybuttons}>
                                    <Button onClick={forgotpassword_handler} label='Cancel' />
                                    <Button label='Send Email' onClick={send_email_handler} />
                                </div>
                            </li >
                            {send_email && <Message label={'Not implemented'} />}
                        </ul >
                    )}
                </div >
            </div >
            <Footer />
        </>
    );
}

export default LogInPage;