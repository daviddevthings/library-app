
import React, { useState } from 'react';
import PropTypes from 'prop-types';
async function loginUser(credentials) {
    let data = await fetch('https://library-dawid-kosieradzki.herokuapp.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    return data.json()
}
export default function Login({ setToken }) {
    const handleSubmit = async e => {
        e.preventDefault();
        console.log(e.target[0].value)
        const token = await loginUser({
            username: e.target[0].value,
            password: e.target[1].value
        });
        // setRole(token.role)
        setToken(token);
    }
    return (
        <div className="flex flex-col items-center h-screen justify-center ">
            <div className=' border-2 border-[#a0a0f3] p-5 rounded-lg space-y-10'>
                <h1 className="text-4xl text-center">Logowanie</h1>
                <form onSubmit={handleSubmit} className="text-lg text-center space-y-5">
                    <div>
                        <label>
                            <p>Nazwa Użytkownika</p>
                            <input type="text" className="rounded-xl bg-[#3c3c3c] border-2 border-[#a0a0f3] text-center py-2 px-5" />
                        </label>
                    </div>
                    <div>
                        <label>
                            <p>Hasło</p>
                            <input type="password" className="rounded-xl bg-[#3c3c3c] border-2 border-[#a0a0f3] text-center py-2 px-5" />
                        </label>
                    </div>

                    <div className='text-center'>
                        <button type="submit" className="rounded-xl bg-[#3c3c3c] border-2 border-[#a0a0f3] text-center py-2 px-5">Zaloguj się</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}