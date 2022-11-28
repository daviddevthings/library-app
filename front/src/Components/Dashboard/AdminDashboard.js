import React, { useState, useEffect, useRef } from 'react';

export default function Dashboard({ token }) {
    const [userData, setUserData] = useState();
    const [bookData, setBookData] = useState({
        author: "",
        title: "",
    });
    const [reserving, setReserving] = useState(false);
    const [adddingBook, setAddingBook] = useState(false);
    const [foundBooks, setFoundBooks] = useState(false);
    const [searchInput, setSearchInput] = useState(null)
    const [outDatedBooks, setOutDatedBooks] = useState(false)
    const handleInput = (event) => {
        event.preventDefault()
        setSearchInput(event.target.value)
    }
    const handleUsernameInput = (event) => {
        event.preventDefault()
        setUserData({
            id: userData.id,
            title: userData.title,
            username: event.target.value
        })
    }
    const handleTitleInput = (event) => {
        event.preventDefault()
        setBookData({
            title: event.target.value,
            author: bookData.author
        })
    }
    const handleAuthorInput = (event) => {
        event.preventDefault()
        setBookData({
            title: bookData.title,
            author: event.target.value
        })
    }
    const findBook = async () => {
        if (searchInput != null) {
            const response = await fetch('https://library-dawid-kosieradzki.herokuapp.com/searchbook', {
                method: 'POST', body: JSON.stringify({
                    "data": searchInput,
                }), headers: {
                    "content-type": "application/json",
                }
            });
            const data = await response.json();
            if (data == []) {
                setFoundBooks(false)
            } else {
                setOutDatedBooks(false)
                setFoundBooks(data)

            }


        }
    }
    const getOutdated = async () => {
        const response = await fetch('https://library-dawid-kosieradzki.herokuapp.com/outdatedbooks', {
            method: 'GET', headers: {
                "content-type": "application/json",
            }
        });
        const data = await response.json();
        if (data == []) {
            setOutDatedBooks(false)
        } else {
            setFoundBooks(false)
            setOutDatedBooks(data)
        }

    }
    const removereservation = async (id) => {
        await fetch('https://library-dawid-kosieradzki.herokuapp.com/removereservation', {
            method: 'POST', body: JSON.stringify({
                "id": id,
            }), headers: {
                "content-type": "application/json",
            }
        });
    }
    const executeScroll = async () => {
        await myRef.current.scrollIntoView({ behavior: 'smooth' }, 1000)
    }
    const reserve = async (id, title) => {
        setReserving(true)
        setUserData({
            id: id,
            title: title,
            username: null
        })
        await executeScroll()
    }
    const completeReserving = async () => {
        await fetch('https://library-dawid-kosieradzki.herokuapp.com/reserve', {
            method: 'POST', body: JSON.stringify({
                "id": userData.id,
                "owner": userData.username
            }), headers: {
                "content-type": "application/json",
            }
        });
        setReserving(!reserving)
    }
    const completeAddingBook = async () => {
        await fetch('https://library-dawid-kosieradzki.herokuapp.com/addbook', {
            method: 'POST', body: JSON.stringify({
                "title": bookData.title,
                "author": bookData.author
            }), headers: {
                "content-type": "application/json",
            }
        });
        setAddingBook(!adddingBook)
        setBookData({
            author: "",
            title: "",
        })
    }
    const myRef = useRef(null)

    return (
        <div>

            <div className='pt-10 px-10' ref={myRef}>
                <h1 className='text-4xl' >Cześć {JSON.parse(localStorage.getItem('token')).username}!</h1>
                <div>
                    <div className='justify-center text-center items-center space-y-5'>
                        <h1 className='text-center text-2xl'>Znajdź Książkę</h1>
                        <div className='flex flex-col space-y-4 items-center'>
                            <button className="bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  py-2 px-5 rounded-lg active:scale-95 transform transition duration-200 ease-out text-white w-fit " type="text" onClick={getOutdated}  >Wyświetl wszystkie książki po terminie</button>
                            <button className="bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  py-2 px-5 rounded-lg active:scale-95 transform transition duration-200 ease-out text-white w-fit " type="text" onClick={() => setAddingBook(true)}  >Dodaj nową książkę do bazy</button>
                        </div>

                        <div className="lg:mx-3  space-x-2 lg:m-0">
                            <input value={searchInput} onChange={handleInput} className="rounded-xl bg-[#3c3c3c] border-2 border-[#a0a0f3] text-center py-2 px-5" type="text" placeholder="Wyszukaj Książkę"></input>
                            <button className="bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  py-2 px-5 rounded-lg active:scale-95 transform transition duration-200 ease-out text-white " type="text" onClick={findBook}  >SZUKAJ</button>
                            {adddingBook &&
                                <div className="flex absolute top-0 left-0 items-center justify-center w-screen   h-full">
                                    <div className="flex flex-col w-fit h-fit border-2 border-[#a0a0f3] p-5 bg-gray-900 space-y-10">
                                        <h1 className="text-center text-2xl">Dodawanie książki</h1>
                                        <div className="space-y-2">
                                            <div className="flex justify-center">
                                                <input
                                                    className="h-10 w-64 rounded-xl bg-[#3c3c3c] border-2 border-[#a0a0f3] px-2 text-center"
                                                    type="text"
                                                    placeholder="Tytuł"
                                                    value={bookData.title} onChange={handleTitleInput}
                                                ></input>
                                            </div>
                                            <div className="flex justify-center">
                                                <input
                                                    className="h-10 w-64 rounded-xl bg-[#3c3c3c] border-2 border-[#a0a0f3] px-2 text-center"
                                                    type="text"
                                                    placeholder="Autor"
                                                    value={bookData.author} onChange={handleAuthorInput}
                                                ></input>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <button
                                                className="w-fit h-10 bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  p-1.5 rounded-lg active:scale-95 transform transition duration-200 ease-out"
                                                onClick={completeAddingBook}
                                            >
                                                Dodaj Książkę
                                            </button>
                                            <button
                                                className="w-fit h-10 bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  p-1.5 rounded-lg active:scale-95 transform transition duration-200 ease-out"
                                                onClick={() => setAddingBook(!adddingBook)}
                                            >
                                                Zamknij
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                            {reserving &&
                                <div className="flex absolute top-0 left-0 items-center justify-center w-screen   h-full">
                                    <div className="flex flex-col w-fit h-fit border-2 border-[#a0a0f3] p-5 bg-gray-900 space-y-10">
                                        <h1 className="text-center text-2xl">Rezerwacja książki "{userData.title}"</h1>
                                        <h1 className="text-center text-2xl">{userData.id}</h1>
                                        <div className="space-y-2">
                                            <div className="flex justify-center">
                                                <input
                                                    className="h-10 w-64 rounded-xl bg-[#3c3c3c] border-2 border-[#a0a0f3] px-2 text-center"
                                                    type="text"
                                                    placeholder="Nazwa użytkownika"
                                                    value={userData.username} onChange={handleUsernameInput}
                                                ></input>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <button
                                                className="w-fit h-10 bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  p-1.5 rounded-lg active:scale-95 transform transition duration-200 ease-out"
                                                onClick={completeReserving}
                                            >
                                                Rezerwuj
                                            </button>
                                            <button
                                                className="w-fit h-10 bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  p-1.5 rounded-lg active:scale-95 transform transition duration-200 ease-out"
                                                onClick={() => setReserving(!reserving)}
                                            >
                                                Zamknij
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                foundBooks &&
                                <table className="table-auto w-full justify-center border-2 border-[#a0a0f3] mt-10">

                                    <thead>
                                        <tr className="text-blue-100 text-xl text-center">
                                            <td className="py-0.5">id</td>
                                            <td className="py-0.5">Wypożyczone przez</td>
                                            <td className="py-0.5">Autor</td>
                                            <td className="py-0.5">Tytuł</td>
                                            <td className="py-0.5">Status</td>
                                            <td className="py-0.5">Zarządzaj</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foundBooks.map((status) => (
                                            <tr className="border-2 border-[#a0a0f3] text-center my-2">
                                                <td className="text-xl py-5">{status["_id"]}</td>
                                                <td className="text-xl py-5">{status.owner == null ? "-" : status.owner}</td>
                                                <td className="text-xl py-5">{status.author}</td>
                                                <td className="text-xl py-5">{status.title}</td>
                                                <td className="text-xl py-5">
                                                    {status.startDate == -1 &&
                                                        <span className='text-green-600'>Dostępny</span>
                                                    }
                                                    {status.startDate != -1 &&
                                                        <span className='text-red-600'>Zarezerwowany do {(new Date(status.startDate + 3600 * 24 * 1000 * 30)).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    }

                                                </td>
                                                <td>
                                                    {status.startDate != -1 &&
                                                        <button className="bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  py-2 px-5 rounded-lg active:scale-95 transform transition duration-200 ease-out text-white " type="text" onClick={() => removereservation(status["_id"])} > Usuń Rezerwację</button>
                                                    }
                                                    {status.startDate == -1 &&
                                                        <button className="bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  py-2 px-5 rounded-lg active:scale-95 transform transition duration-200 ease-out text-white " type="text" onClick={() => reserve(status["_id"], status.title)} > Rezerwuj</button>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>
                            }
                            {
                                outDatedBooks &&
                                <table className="table-auto w-full justify-center border-2 border-[#a0a0f3] mt-10">

                                    <thead>
                                        <tr className="text-blue-100 text-xl text-center">
                                            <td className="py-0.5">id</td>
                                            <td className="py-0.5">Wypożyczone przez</td>
                                            <td className="py-0.5">Autor</td>
                                            <td className="py-0.5">Tytuł</td>
                                            <td className="py-0.5">Status</td>
                                            <td className="py-0.5">Zarządzaj</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {outDatedBooks.map((status) => (
                                            <tr className="border-2 border-[#a0a0f3] text-center my-2">
                                                <td className="text-xl py-5">{status["_id"]}</td>
                                                <td className="text-xl py-5">{status.owner == null ? "-" : status.owner}</td>
                                                <td className="text-xl py-5">{status.author}</td>
                                                <td className="text-xl py-5">{status.title}</td>
                                                <td className="text-xl py-5">
                                                    {status.startDate == -1 &&
                                                        <span className='text-green-600'>Dostępny</span>
                                                    }
                                                    {status.startDate != -1 &&
                                                        <span className='text-red-600'>Zarezerwowany do {(new Date(status.startDate + 3600 * 24 * 1000 * 30)).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    }

                                                </td>
                                                <td>
                                                    {status.startDate != -1 &&
                                                        <button className="bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  py-2 px-5 rounded-lg active:scale-95 transform transition duration-200 ease-out text-white " type="text" onClick={() => removereservation(status["_id"])}>Usuń Rezerwację</button>
                                                    }
                                                    {status.startDate == -1 &&
                                                        <span className='text-red-600'>Zarezerwowany do {(new Date(status.startDate + 3600 * 24 * 1000 * 30)).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}