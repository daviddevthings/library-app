import React, { useState, useEffect } from 'react';

export default function Dashboard({ token }) {
  const [userData, setUserData] = useState();
  const [foundBooks, setFoundBooks] = useState(false);
  const [searchInput, setSearchInput] = useState(null)
  const [invalidData, setInvalidData] = useState(false)
  const handleInput = (event) => {
    event.preventDefault()
    setSearchInput(event.target.value)
  }
  useEffect(() => {
    if (!userData) {
      async function getBooks() {
        let data = await fetch(`https://library-dawid-kosieradzki.herokuapp.com/user/${JSON.parse(localStorage.getItem('token')).username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        let response = await data.json()
        setUserData(response)
      }
      getBooks();
    }
  })
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
      if (data.length == 0) {
        setInvalidData(true)
        setFoundBooks(false)
      } else {
        setFoundBooks(data)
        setInvalidData(false)
      }


    }
  }
  return (
    <div>
      <div className='pt-10 px-10'>
        <h1 className='my-10 text-4xl'>Cześć {JSON.parse(localStorage.getItem('token')).username}!</h1>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className=' space-y-5'>
            <h2 className='text-2xl text-center'>Twoje {userData?.length} {(userData?.length == 0 || userData?.length > 4) && userData?.length != 1 ? "książek" : "książki"}:</h2>
            <table className="table-auto w-full justify-center">
              <tbody>
                {userData?.map((status) => (
                  <tr className="text-center border-b first:border-t">
                    <td className="py-3">{status.author}</td>
                    <td className="py-3">{status.title}</td>
                    <td className="py-3">
                      {
                        Date.now() > status.startDate + 30 * 3600 * 24 * 1000 ?
                          <span className='text-red-600'>Minął termin oddania</span>
                          :
                          <span>Termin oddania: {(new Date(status.startDate + 30 * 3600 * 24 * 1000)).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      }

                    </td>
                  </tr>
                ))
                }
              </tbody>
            </table>
          </div>

          <div className='  justify-center text-center items-center space-y-5 lg:col-span-2'>
            <h1 className='text-center text-2xl'>Znajdź Książkę</h1>
            <div className="lg:mx-3  lg:m-0">
              <div className='space-y-10 lg:space-y-0'>
                <input value={searchInput} onChange={handleInput} className="rounded-xl bg-[#3c3c3c] border-2 border-[#a0a0f3] text-center py-2 px-5" type="text" placeholder="Wyszukaj Książkę"></input>
                <button className="bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  py-2 px-5 rounded-lg active:scale-95 transform transition duration-200 ease-out text-white " type="text" onClick={findBook}  >SZUKAJ</button>
              </div>
              {
                invalidData &&
                <div>
                  <p className="text-lg text-red-600">Nie znaleziono podanego tytułu / autora</p>
                </div>

              }
              {
                foundBooks &&
                <table className="table-auto w-full justify-center border mt-10">

                  <thead>
                    <tr className="text-blue-100 text-xl text-center">
                      <td className="py-0.5">Autor</td>
                      <td className="py-0.5">Tytuł</td>
                      <td className="py-0.5">Status</td>
                    </tr>
                  </thead>
                  <tbody>
                    {foundBooks.map((status) => (
                      <tr className="border text-center">
                        <td className="text-xl py-5">{status.author}</td>
                        <td className="text-xl py-5">{status.title}</td>
                        <td className="text-xl py-5">
                          {status.startDate == -1 &&
                            <span className='text-green-600'>Dostępny</span>
                          }
                          {status.startDate != -1 &&
                            <span className='text-red-600'>Zarezerwowany do {(new Date(status.startDate + 3600 * 24 * 30 * 1000)).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
    </div>
  );
}