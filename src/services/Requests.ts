import { Dispatch } from 'react'

export async function getGenres (genres: any):Promise<void> {
  let response = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=e157b66a2125cee8a15a44803b9e8963")
  let dataGenres = await response.json()
  genres(dataGenres.genres)
}

export async function createGuestSession ():Promise<void> {
  let response = await fetch(
    "https://api.themoviedb.org/3/authentication/guest_session/new?api_key=e157b66a2125cee8a15a44803b9e8963")
  let session = await response.json()
  localStorage.setItem("name", session.guest_session_id)
}

export async function getMovies  (data:any, loading:Dispatch<boolean>, error:Dispatch<boolean>, title: string, page: number | null):Promise<void> {
  await fetch(`https://api.themoviedb.org/3/search/movie?api_key=e157b66a2125cee8a15a44803b9e8963&query=${title}&page=${page}`)
    .then((res) => {
      if (res.ok) {
        res.json().then((movie) => {
          data(movie.results);
          loading(false);
        });
      } else {
        loading(false);
        error(true);
      }
    });
}

export async function rateMovie (movieId: number, value: number):Promise<void> {
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

export async function getRatedMovie (rate:any, loading:Dispatch<boolean>):Promise<void> {
  let guestSessionId = localStorage.getItem("name");
  let res = await fetch(
    `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=e157b66a2125cee8a15a44803b9e8963&language=en-US&sort_by=created_at.asc`)
  let ratedFilms = await res.json()
  rate(ratedFilms.results)
  loading(false)
  console.log(rate)
}

