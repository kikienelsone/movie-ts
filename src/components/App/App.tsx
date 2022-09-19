import "./App.css";
import "../MovieList/MovieList.css";
import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { intlFormat } from "date-fns";
import { Alert, Pagination, Spin, Tabs } from "antd";

import { debounce } from "lodash";
import Input from "../Input/Input";
import MovieList from "../MovieList/MovieList";
import { GenresProvider } from "../Context/Context";
import Movie from "../Movie/Movie";

const App: React.FC = () => {
  const url: string =
    "https://api.themoviedb.org/3/search/movie?api_key=e157b66a2125cee8a15a44803b9e8963";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState([]);
  const [rate, setRate] = useState([]);

  async function getMovies  (title: string, page: number) {
    await fetch(`${url}&query=${title}&page=${page}`)
      .then((res) => {
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
  }

  useEffect(() => {
    getMovies("return", 1)
    getGenres();
    createGuestSession();
  }, []);

  async function getGenres () {
    let response = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=e157b66a2125cee8a15a44803b9e8963")
    let dataGenres = await response.json()
    setGenres(dataGenres.genres)
  }

  // нужно создать гостевую сессию чтоб получить токен
  async function createGuestSession () {
    let response = await fetch(
      "https://api.themoviedb.org/3/authentication/guest_session/new?api_key=e157b66a2125cee8a15a44803b9e8963"
    )
    let session = await response.json()
    localStorage.setItem("name", session.guest_session_id)

  }

  // показывает фильмы с сердечками
  // работает через раз
  // ахуенно
  async function getRatedMovie () {
    let guestSessionId = localStorage.getItem("name");
    let res = await fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=e157b66a2125cee8a15a44803b9e8963&language=en-US&sort_by=created_at.asc`)
      let ratedFilms = await res.json()
      setRate(ratedFilms.results)
      setLoading(false)
      console.log(rate)
  }

 // поставить рейтинг фильму
  async function rateMovie (movieId: number, value: number) {
    let guestSessionId = localStorage.getItem("name");
    let res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=e157b66a2125cee8a15a44803b9e8963&guest_session_id=${guestSessionId}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          value: value,
        }),
      }
    )
     await res.json()
  }

  async function pagination (page: number) {
    let res = await fetch(`${url}&query=return&page=${page}`)
    let movie = await res.json()
    setData(movie.results)
    setLoading(false)
  }

  async function search (event: string)  {
    console.log(event);
    if (event) {
      let res = await fetch(`${url}&query=${event}`)
      let movie = await res.json()
      setData(movie.results);
    } else await getMovies("return", 1);

  }

  const date = (day: string) => {
    if (day) {
      return intlFormat(
        new Date(day),
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
        {
          locale: "en",
        }
      );
    } else return "June 21, 1985";
  };
  const delay = debounce(search, 300);
  const spinner = loading ? (
    <Spin tip="Loading...">
      <Alert
        message="Movies is coming"
        description="Further details about the context of this alert."
        type="info"
      />
    </Spin>
  ) : null;
  const { TabPane } = Tabs;
  const movieData = !loading ? (
    <MovieList rateMovie={rateMovie} data={data} date={date} />
  ) : null;
  if (error) {
    return <Alert message="OMG" type="info" closeText="Close It Now!" />;
  }

  return (
    <GenresProvider value={genres}>
      <div className="app">
        <div className="app__tabs">
          <Tabs
            onChange={(event) => {
              if (event === "2") {
                getRatedMovie();
              }
            }}
            defaultActiveKey="1"
          >
            <TabPane tab="Search" key="1">
              <div className="app__input">
                <Input delay={delay} />
              </div>
              {movieData}
              {spinner}
              <div className="app__pagination">
                <Pagination
                  onChange={pagination}
                  defaultCurrent={1}
                  total={50}
                />
              </div>
            </TabPane>
            <TabPane tab="Rate" key="2">
              {spinner}
              <div>
                <ul className="movie-list">
                  {rate.map((item) => {
                    return (
                      <li className="movie-list__item">
                        <Movie item={item} date={date} rateMovie={rateMovie} />
                      </li>
                    );
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
