import './App.css'
import '../MovieList/MovieList.css'
import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { intlFormat } from 'date-fns'
import { Alert, Pagination, Spin, Tabs } from 'antd'

import { debounce } from 'lodash'
import Input from '../Input/Input'
import MovieList from '../MovieList/MovieList'
import { GenresProvider } from '../Context/Context'
import Movie from '../Movie/Movie'
import { GenresProps } from '../Intefaces/GenresProps'

const App:React.FC = () => {
  const url:string = 'https://api.themoviedb.org/3/search/movie?api_key=e157b66a2125cee8a15a44803b9e8963';

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState([]);
  const [rate, setRate] = useState([])

  const getMovies = (title:string, page:number) => {
    fetch(`${url}&query=${title}&page=${page}`).then((res) => {
      if (res.ok) {
        res.json().then((movie) => {
          setData(movie.results);
          setLoading(false);
        });
      } else {
        setLoading(false);
        setError(true);
      }
    });
  };

  useEffect(() => {
    getMovies('return',1);
    getGenres();
    createGuestSession();
    // getRatedMovie();
  }, []);

  const getGenres = () => {
    fetch(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=e157b66a2125cee8a15a44803b9e8963'
    )
      .then((res) => res.json())
      .then((dataGenres) => {
        setGenres(dataGenres.genres);
      });
  };

  // нужно создать гостевую сессию чтоб получить токен
  const createGuestSession = () => {
    fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=e157b66a2125cee8a15a44803b9e8963'
    )
      .then((res) => res.json())
      .then((session) =>
        localStorage.setItem("name", session.guest_session_id)
      );
  };

  // показывает фильмы с сердечками
  // работает через раз
  // ахуенно
  const getRatedMovie = () => {
    let guestSessionId = localStorage.getItem('name');
    fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=e157b66a2125cee8a15a44803b9e8963&language=en-US&sort_by=created_at.asc`
    )
      .then((res) => res.json())
      .then((res) => {
        setRate(res.results)
      })
      .then(()=> setLoading(false))
      .then(()=>console.log(rate))

  };

  //поставить сердечко фильму.
  // куда вставить токен?
  // или не токен?
  // ебать просто
  const rateMovie = (movieId: number, value: number) => {
    let guestSessionId = localStorage.getItem('name');
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=e157b66a2125cee8a15a44803b9e8963&guest_session_id=${guestSessionId}`, {
          method: 'post',
          headers:{
            'Content-Type': 'application/json;charset=utf-8'
          },
        body: JSON.stringify({
          // movieId: movieId,
          value: value
        })
      })
          .then((res) => res.json())
          .then((res1) => {
            console.log(res1)
          });
  };

  const pagination = (page: number) => {
    fetch(`${url}&query=return&page=${page}`).then((res) => {
      if (res.ok) {
        res.json().then((movie) => {
          setData(movie.results);
          setLoading(false);
        });
      }
    });
    // this.getMovies(title, page);
  };

  const search = (event: string) => {
    console.log(event);
    if (event) {
      fetch(`${url}&query=${event}`)
        .then((res) => res.json())
        .then((movie) => {
          setData(movie.results);
        });
    } else getMovies('return', 1);

    // getMovies(event.target.value);
  };

  const date = (day: string) => {
    if (day) {
      return intlFormat(
        new Date(day),
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        {
          locale: 'en',
        }
      );
    } else return 'June 21, 1985';
  };
  const delay = debounce(search, 300);
  const spinner = loading ? (
    <Spin tip='Loading...'>
      <Alert
        message='Movies is coming'
        description='Further details about the context of this alert.'
        type='info'
      />
    </Spin>
  ) : null;
  const { TabPane } = Tabs;
  const movieData = !loading ? <MovieList rateMovie={rateMovie} data={data} date={date} /> : null;
  if (error) {
    return <Alert message='OMG' type='info' closeText='Close It Now!' />;
  }

  return (
    <GenresProvider value={genres}>
      <div className='app'>
        <div  className='app__tabs'>
          <Tabs onChange={(event)=> {
            if (event === '2'){
              getRatedMovie()
            }
          }} defaultActiveKey='1'>
            <TabPane tab='Search' key='1'>
              <div className='app__input'>
                <Input delay={delay} />
              </div>
              {movieData}
              {spinner}
              <div className='app__pagination'>
                <Pagination onChange={pagination} defaultCurrent={1} total={50} />
              </div>
            </TabPane>
            <TabPane tab='Rate' key='2'>
              {spinner}
              <div>
                <ul className="movie-list">
                  {rate.map(item =>{
                    return (
                      <li className="movie-list__item" >
                        <Movie item={item} date={date} rateMovie={rateMovie}/>
                      </li>
                      )
                  })}
                </ul>
              </div>

            </TabPane>
          </Tabs>
        </div>


      </div>
    </GenresProvider>
  );
};
export default App;
