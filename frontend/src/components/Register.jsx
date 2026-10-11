import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Register = () => {
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        usertype: "student"
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8080/api/users/signup', input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/register'); // Assuming /register is the login page in this app
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 w-96'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Create a new account</p>
                </div>
                <div>
                    <span className='font-medium'>Name</span>
                    <Input
                        type="text"
                        name="name"
                        value={input.name}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                        required
                    />
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                        required
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                        required
                    />
                </div>
                <div>
                    <span className='font-medium'>User Type</span>
                    <select
                        name="usertype"
                        value={input.usertype}
                        onChange={changeEventHandler}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-2"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="mentor">Mentor</option>
                    </select>
                </div>
                {
                    loading ? (
                        <Button disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Sign Up</Button>
                    )
                }

                <span className='text-center'>Already have an account? <Link to="/register" className='text-blue-600'>Login</Link></span>
            </form>
        </div>
    )
}

export default Register;
