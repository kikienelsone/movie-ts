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
import { createGuestSession, getGenres, getMovies, getRatedMovie } from '../../services/Requests'

const App: React.FC = () => {
  const url: string =
    "https://api.themoviedb.org/3/search/movie?api_key=e157b66a2125cee8a15a44803b9e8963";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState([]);
  const [rate, setRate] = useState([]);

  useEffect(() => {
    getMovies(setData, setLoading, setError, "return", 2)
    getGenres(setGenres);
    createGuestSession();
  }, []);

  async function pagination (page: number):Promise<void> {
    let res = await fetch(`${url}&query=return&page=${page}`)
    let movie = await res.json()
    setData(movie.results)
    setLoading(false)
  }

  async function search (event: string, page: number | null):Promise<void>  {
    console.log(event);
    if (event !== "") {
      let res = await fetch(`${url}&query=${event}&page=${page}`)
      let movie = await res.json()
      setData(movie.results);
    }
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
    <MovieList data={data} date={date} />
  ) : null;

  const paginate = data.length ? <Pagination
    onChange={pagination}
    defaultCurrent={1}
    total={50}
  /> : null
  if (error) {
    return <Alert message="OMG" type="info" closeText="Close It Now!"  onClose={()=> getMovies(setData, setLoading, setError, "return", 2)}/>;
  }

  return (
    <GenresProvider value={genres}>
      <div className="app">
        <div className="app__tabs">
          <Tabs
            onChange={(event) => {
              if (event === "2") {
                getRatedMovie(setRate, setLoading);
              }
            }}
            defaultActiveKey="1"
          >
            <TabPane tab="Search" key="1">
              <div className="app__input">
                <Input delay={debounce(search, 600)} />
              </div>
              {movieData}
              {spinner}
              <div className="app__pagination">{paginate}</div>
            </TabPane>
            <TabPane tab="Rate" key="2">
              {spinner}
              <div>
                <ul className="movie-list">
                  {rate.map((item) => {
                    return (
                      <li className="movie-list__item">
                        <Movie item={item} date={date}/>
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
