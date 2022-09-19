import React from "react";
import "./Movie.css";
import { Rate } from "antd";
import { GenresConsumer } from "../Context/Context";

// @ts-ignore
import img from "../Movie/movieImg.png";
import { DataProps } from '../Intefaces/DataProps'
import { GenresProps } from '../Intefaces/GenresProps'

const Movie = (props: {
  item: DataProps
  date: (
    arg: string
  ) => string
  rateMovie: (arg1: number, arg2: number) => void

}) => {
  const rate = props.item.rating ? props.item.rating : 0
  const posterAllPath = `https://image.tmdb.org/t/p/original${props.item.poster_path}`;
  const posterImg =
    posterAllPath ? (
      <img className="movie-item__image" src={posterAllPath} alt="img" />
    ) : (
      <img className="movie-item__image" src={img} alt="img" />
    );
  const styles =
    (props.item.vote_average) <= 3 ? (
      <div
        style={{ border: "4px solid #E90000" }}
        className="movie-item__circle"
      >
        {props.item.vote_average}
      </div>
    ) : props.item.vote_average > 3 && props.item.vote_average < 5 ? (
      <div
        style={{ border: "4px solid #E97E00" }}
        className="movie-item__circle"
      >
        {props.item.vote_average}
      </div>
    ) : props.item.vote_average > 5 && props.item.vote_average < 7 ? (
      <div
        style={{ border: "4px solid #E9D100" }}
        className="movie-item__circle"
      >
        {props.item.vote_average}
      </div>
    ) : (
      <div
        style={{ border: "4px solid #66E900" }}
        className="movie-item__circle"
      >
        {props.item.vote_average}
      </div>
    );

  return (
    <GenresConsumer >
      {(genres) => (
        <div className="movie-item">
          {posterImg}
          <div className="movie-item__content">
            <h1 className="movie-item__header">{props.item.title}</h1>
            <p className="movie-item__date">
              {props.date(props.item.release_date)}
            </p>
            {styles}

            {genres.map((genre: GenresProps) => {
              if (props.item.genre_ids.includes(genre.id)) {
                return <span key={genre.id} className="movie-item__genre">{genre.name}</span>;
              }
            }).slice(2)}

            <p className="movie-item__text">{props.item.overview}</p>
            <div className="movie-item__rate">
              <Rate
                allowHalf
                onChange={(value) => props.rateMovie(props.item.id, value)}
                defaultValue={rate}
                count={10}
              />
            </div>
          </div>
        </div>
      )}
    </GenresConsumer>
  );
}
export default Movie