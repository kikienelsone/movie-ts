import React from "react";
import "./Movie.css";
import { Rate } from "antd";
import { GenresConsumer } from "../Context/Context";

// @ts-ignore
import img from "../Movie/movieImg.png";
import { MovieDataProps } from "../Intefaces/MovieDataProps";
import { GenresProps } from "../Intefaces/GenresProps";
import { rateMovie } from '../../services/Requests'
import { styles } from '../../services/Styles'

interface MovieProps {
  item: MovieDataProps;
  date: (arg: string) => string;
}

const Movie:React.FC<MovieProps> = ({ item,date }) => {
  const rate = item.rating ? item.rating : 0;
  const posterAllPath = `https://image.tmdb.org/t/p/original${item.poster_path}`;
  const posterImg = posterAllPath ? (
    <img className="movie-item__image" src={posterAllPath} alt="img" />
  ) : (
    <img className="movie-item__image" src={img} alt="img" />
  );

    return (
    <GenresConsumer>
      {(genres) => (
        <div className="movie-item">
          {posterImg}
          <div className="movie-item__content">
            <h1 className="movie-item__header">{item.title}</h1>
            <p className="movie-item__date">
              {date(item.release_date)}
            </p>
            <div className={`movie-item__circle ${styles(item.vote_average)}`}>
              {item.vote_average}
            </div>
            {genres
              .map((genre: GenresProps) => {
                if (item.genre_ids.includes(genre.id)) {
                  return (
                    <span key={genre.id} className="movie-item__genre">
                      {genre.name}
                    </span>
                  );
                }
              })
              .slice(2)}

            <p className="movie-item__text">{item.overview}</p>
            <div className="movie-item__rate">
              <Rate
                allowHalf
                onChange={(value) => rateMovie(item.id, value)}
                defaultValue={rate}
                count={10}
              />
            </div>
          </div>
        </div>
      )}
    </GenresConsumer>
  );
};
export default Movie;
