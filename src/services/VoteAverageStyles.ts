
export const voteAverageStyles = (vote:number|boolean)=> {
  if (vote <= 3)return " circle__red"
  if (vote <= 5)return " movie-item__circle circle__orange"
  if (vote <= 7)return " movie-item__circle circle__yellow"
  if (vote > 7)return " movie-item__circle circle__green"
}