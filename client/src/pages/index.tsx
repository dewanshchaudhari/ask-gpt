import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
const inter = Inter({ subsets: ['latin'] })
function useDebounceValue(value: string, time = 250) {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value)
    }, time);
    return () => {
      clearTimeout(timeout);
    }
  }, [value, time]);
  return debounceValue;
}
export default function Home() {
  const router = useRouter();
  const [type, SetType] = useState('explain');
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState('5');
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState({
    name: '',
    credit: 0,
    phone: ''
  });
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceQuery = useDebounceValue(query);
  const handleTypeClick = (e: any, buttonType: string) => {
    SetType(buttonType);
  };
  const checkAuth = async () => {
    try {
      const waId = router?.query?.waId || localStorage.getItem('waId');
      if (!waId) return router.push('/signup');
      const response = await fetch(`http://localhost:8000/user/${waId}`);
      if (!response.ok) return router.push('/signup');
      const { name, credit, phone } = await response.json();
      setUser({
        name,
        credit,
        phone
      });
      localStorage.setItem('waId', waId.toString());
      setInitialLoading(false);
    } catch (error) {
      setInitialLoading(false);
      console.log(error);
    }
  }
  useEffect(() => {
    (async () => {
      if (!debounceQuery) {
        setSuggestions([]);
        return;
      }
      const suggestionsResponse = await fetch(`http://localhost:8000/query?query=${debounceQuery}`);
      const json = await suggestionsResponse.json();
      console.log(json);
      setSuggestions(json);
    })();
  }, [debounceQuery]);
  useEffect(() => {
    if (!router.isReady) return;
    checkAuth();
  }, [router.isReady])

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { subject, age, lang } = e.target;
    const response = await fetch(`http://localhost:8000/results/${localStorage.getItem('waId')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: subject.value, age: age.value, lang: lang.value, type })
    });
    if (!response.ok) console.log(response);
    const json = await response.json();
    setLoading(false);
    Router.push(`/results/${json.id}`);
  };
  return (
    <>{initialLoading ?
      <div className='flex flex-col items-center justify-center'> <progress className="progress w-100"></progress> </div> :
      <>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost normal-case text-xl">
              Hi, {user.name}
            </Link>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <span className="badge badge-sm indicator-item">{user.credit}</span>
                </div>
              </label>
              <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div className="card-body">
                  <span className="font-bold text-lg text-center">{user.credit} credits left</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block">Purchase credits</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li onClick={() => {
                  localStorage.removeItem('waId');
                  router.push('/signup');
                }}><a>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card w-100 bg-base-100 shadow-xl">
          <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <div className="tabs tabs-boxed flex flex-row items-center justify-evenly">
                <a className={`tab ${type === 'explain' ? 'tab-active' : ''}`} onClick={(e) => handleTypeClick(e, 'explain')}>Explain</a>
                <a className={`tab ${type === 'summarize' ? 'tab-active' : ''}`} onClick={(e) => handleTypeClick(e, 'summarize')}>Summarize</a>
              </div>
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <input type="text" name='subject' value={query} autoComplete='new-password' onChange={e => setQuery(e.target.value)} placeholder={`${type === 'explain' ? 'Type Here' : 'Paste Link'}`} className="input input-bordered w-full my-2" required />
              {suggestions.length ? <ul className="menu bg-base-100 w-100 rounded-box">
                {suggestions.slice(0, 3).map((suggestion, i) => <li key={i} onClick={() => { setQuery(suggestion); setSuggestions([]) }}><a>{suggestion}</a></li>)}
              </ul> : <></>}
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <select value={age}
                onChange={e => setAge(e.target.value)} className="select select-bordered w-full my-2" name='age' required>
                <option disabled>Select age</option>
                <option value='5'>5 years</option>
                <option value='10'>10 years</option>
                <option value='20'>20 years</option>
                <option value='-1'>Expert</option>
              </select>
              <label className="label">
                <span className="label-text">Select Language</span>
              </label>
              <select className="select select-bordered w-full my-2" name='lang' required>
                <option disabled>Select Language</option>
                <option value='en'>English</option>
                <option value='hi'>Hindi</option>
              </select>
              {loading ? <progress className="progress w-100"></progress> : <div className='flex flex-row items-center justify-evenly'>
                <button type='submit' className="swap-on btn btn-primary my-2">{`${type} like I am ${age === '-1' ? 'Expert' : age}`}</button>
              </div>}
            </form>
          </div>
        </div >
      </>}
    </>
  )
}
