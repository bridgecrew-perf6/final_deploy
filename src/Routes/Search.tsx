import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getSearchMovie,
  getSearchTV,
  IGetMoviesResult,
  IGetTVsResult,
} from "../api";
import { makeImagePath } from "../utils";

function Search() {
  const location = useLocation();
  console.log(location);
  const search = new URLSearchParams(location.search).get("keyword");
  console.log(search);

  const { data: searchTv, isLoading: loadingTv } = useQuery<IGetTVsResult>(
    ["tv", search],
    () => getSearchTV(search + "")
  );

  const { data: searchMovie, isLoading: loadingMovie } =
    useQuery<IGetMoviesResult>(["movie", search], () =>
      getSearchMovie(search + "")
    );

  const loading = loadingTv || loadingMovie;
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const history = useHistory();

  const toggleLeaving = () => setLeaving(prev => !prev);
  const offset = 6;

  // console.log(searchMovie, searchTv);
  const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
    padding: 2rem;
  `;
  const rowVariants = {
    hidden: {
      x: window.outerWidth + 5,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -window.outerWidth - 5,
    },
  };

  const boxVariants = {
    normal: {
      scale: 1,
    },
    hover: {
      scale: 1.3,
      y: -80,
      transition: {
        delay: 0.5,
        duaration: 0.1,
        type: "tween",
      },
    },
  };
  const infoVariants = {
    hover: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duaration: 0.1,
        type: "tween",
      },
    },
  };

  const onTvClicked = (tvId: number) => {
    history.push(`search/tv/${tvId}`);
  };
  const onmovieClicked = (movieId: number) => {
    history.push(`search/movie/${movieId}`);
  };

  const data = searchMovie;

  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const searchTvMatch = useRouteMatch<{ tvId: string }>("/search/tv/:tvId");
  const searchMovieMatch = useRouteMatch<{ movieId: string }>(
    "/search/movie/:tvId"
  );

  const clickedTV =
    searchTvMatch?.params.tvId &&
    searchTv?.results.find(movie => movie.id === +searchTvMatch.params.tvId);

  const clickedMovie =
    searchMovieMatch?.params.movieId &&
    searchMovie?.results.find(
      movie => movie.id === +searchMovieMatch.params.movieId
    );

  const onOverlayClick = () => history.push("/search");

  const { scrollY } = useViewportScroll();

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <div onClick={incraseIndex}>
            <MovieSlider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <SubTitle>검색어와 관련있는 영화</SubTitle>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {searchMovie?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map(tv => (
                      <Box
                        layoutId={tv.id + ""}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onmovieClicked(tv.id)}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </MovieSlider>
            <TvSlider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <SubTitle>검색어와 관련있는 인기 TV Show</SubTitle>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {searchTv?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map(tv => (
                      <Box
                        layoutId={tv.id + ""}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onTvClicked(tv.id)}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </TvSlider>

            <AnimatePresence>
              {searchTvMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    style={{ top: scrollY.get() + 100 }}
                    layoutId={searchTvMatch.params.tvId}
                  >
                    {clickedTV && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedTV.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedTV.name}</BigTitle>
                        <BigOverview>{clickedTV.overview}</BigOverview>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {searchMovieMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    style={{ top: scrollY.get() + 100 }}
                    layoutId={searchMovieMatch.params.movieId}
                  >
                    {clickedMovie && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedMovie.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </div>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  /* 이미지가 안찌그러지도록 하는 방법 => img src 그만 쓰셈 */
`;

const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${props => props.theme.white.lighter};
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${props => props.theme.black.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${props => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const SubTitle = styled.div`
  font-size: 1.4vw;
  color: #e5e5e5;
  font-weight: 700;
  margin: 0 4% 1.5em 2%;
  text-decoration: none;
  display: inline-block;
  min-width: 6em;
`;

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MovieSlider = styled.div`
  position: relative;
  top: 150px;
`;
const TvSlider = styled.div`
  position: relative;
  top: 400px;
`;
