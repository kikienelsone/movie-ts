import React from "react";
import { GenresProps } from "../Intefaces/GenresProps";

const { Provider: GenresProvider, Consumer: GenresConsumer } =
  React.createContext([]);
export { GenresProvider, GenresConsumer };
